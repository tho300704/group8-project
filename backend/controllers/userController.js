// /backend/controllers/userController.js

const User = require('../models/User'); // Đảm bảo đường dẫn đúng
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import module crypto sẵn có của Node.js
const sendEmail = require('../utils/sendEmail'); // Import hàm gửi email
const cloudinary = require('../utils/cloudinary');
const crypto = require('crypto');
/*
// Hàm trợ giúp để tạo token -> Tránh lặp code
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token hết hạn sau 1 ngày
    });
};
*/
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Thời gian sống ngắn: 15 phút
    });
};
// Hàm tạo Refresh Token và lưu vào cookie
const generateAndSetRefreshToken = async (user, ipAddress, res) => {
    // Tạo một chuỗi token ngẫu nhiên
    const token = crypto.randomBytes(40).toString('hex');
    
    // Tạo đối tượng Refresh Token để lưu vào DB
    const refreshToken = new RefreshToken({
        user: user._id,
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Hết hạn sau 7 ngày
        createdByIp: ipAddress
    });

    await refreshToken.save();

    // Set cookie ở phía client
    res.cookie('refreshToken', token, {
        httpOnly: true, // Chỉ server có thể truy cập, chống XSS
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
        sameSite: 'strict', // Chống CSRF
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    });
};

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/users/signup
 * @access  Public
 */
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        // BƯỚC QUAN TRỌNG: IN LỖI CHI TIẾT RA CONSOLE CỦA SERVER
        console.error('!!!!!!!!!! LỖI KHI ĐĂNG KÝ !!!!!!!!!!');
        console.error(error); // In ra toàn bộ đối tượng lỗi

        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

/**
 * @desc    Đăng nhập người dùng (ĐÃ CẬP NHẬT)
 * @route   POST /api/users/login
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = generateAccessToken(user);
            await generateAndSetRefreshToken(user, req.ip, res);

            // Chỉ trả về accessToken, refreshToken được gửi qua cookie
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

/**
 * @desc    Tạo Access Token mới từ Refresh Token
 * @route   POST /api/users/refresh-token
 */
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Không tìm thấy token' });
    }

    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token }).populate('user');

        if (!refreshTokenDoc || !refreshTokenDoc.isActive) {
            return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
        }

        const { user } = refreshTokenDoc;
        const newAccessToken = generateAccessToken(user);

        res.json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

/**
 * @desc    Đăng xuất người dùng (thu hồi token)
 * @route   POST /api/users/logout
 */
const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken;
    
    if (!token) {
        return res.status(204).send(); // No content
    }

    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token });
        if (refreshTokenDoc) {
            refreshTokenDoc.revoked = Date.now();
            refreshTokenDoc.revokedByIp = req.ip;
            await refreshTokenDoc.save();
        }
        
        // Xóa cookie ở client
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Đăng xuất thành công' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
// ==========================================================
// ======   BẮT ĐẦU PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 2   ======
// ==========================================================

/**
 * @desc    Lấy thông tin cá nhân của người dùng đã đăng nhập
 * @route   GET /api/users/profile
 * @access  Private (Yêu cầu đăng nhập)
 */
const getUserProfile = async (req, res) => {
    // Middleware 'protect' đã chạy trước và gắn `req.user` vào request.
    // Chúng ta chỉ cần trả về thông tin đó.
    // `req.user` đã được loại bỏ mật khẩu bởi middleware.
    res.json(req.user);
};

/**
 * @desc    Cập nhật thông tin cá nhân của người dùng
 * @route   PUT /api/users/profile
 * @access  Private (Yêu cầu đăng nhập)
 */
const updateUserProfile = async (req, res) => {
    // Lấy user từ DB để đảm bảo chúng ta đang làm việc với dữ liệu mới nhất.
    const user = await User.findById(req.user._id);

    if (user) {
        // Cập nhật tên và email nếu chúng được cung cấp trong body.
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Nếu người dùng gửi lên mật khẩu mới, cập nhật nó.
        if (req.body.password) {
            // Chỉ cần gán mật khẩu mới.
            // Schema's pre-save hook sẽ tự động mã hóa nó trước khi lưu.
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Trả về thông tin user đã được cập nhật cùng với một token mới.
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};


// ==========================================================
// ======   KẾT THÚC PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 2   ======
// ==========================================================
/**
 * @desc    Lấy tất cả người dùng (chỉ Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
    const users = await User.find({}); // Lấy tất cả user từ DB
    res.json(users);
};

/**
 * @desc    Xóa một người dùng (chỉ Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Có thể thêm logic không cho admin tự xóa chính mình
        if (req.user._id.equals(user._id)) {
            return res.status(400).json({ message: 'Admin không thể tự xóa chính mình.' });
        }
        await user.deleteOne();
        res.json({ message: 'Người dùng đã được xóa' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};
/**
 * @desc    Quên mật khẩu
 * @route   POST /api/users/forgotpassword
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
    }

    // Tạo token reset
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Băm token và lưu vào DB
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

    await user.save({ validateBeforeSave: false });

    // Tạo URL reset
    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập link sau để đặt lại mật khẩu:\n\n${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            message,
        });
        res.status(200).json({ success: true, data: 'Email đã được gửi' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'Lỗi khi gửi email' });
    }
};

/**
 * @desc    Đặt lại mật khẩu
 * @route   PUT /api/users/resetpassword/:resettoken
 * @access  Public
 */
const resetPassword = async (req, res) => {
    // Lấy token đã băm từ URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }, // Token chưa hết hạn
    });

    if (!user) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Đặt mật khẩu mới
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
};
/**
 * @desc    Upload avatar cho người dùng
 * @route   PUT /api/users/profile/avatar
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Nếu đã có avatar cũ, xóa nó đi
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Upload ảnh mới lên Cloudinary
        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale',
        });

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        await user.save();

        res.status(200).json({ success: true, avatar: user.avatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi upload avatar', error: error.message });
    }
};


module.exports = {
    signupUser,
    loginUser,
    getUserProfile,   // << Thêm vào đây
    updateUserProfile,// << Thêm vào đây
    getUsers,     // << Thêm hàm mới
    deleteUser,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    refreshToken,
    logoutUser,
};