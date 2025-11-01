// /backend/controllers/userController.js

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp');
const logActivity = require('../middleware/logMiddleware');
const Log = require('../models/Log');

// --- HÀM TRỢ GIÚP ---

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Thời gian sống ngắn
    });
};

const generateAndSetRefreshToken = async (user, ipAddress, res) => {
    const token = crypto.randomBytes(40).toString('hex');
    const refreshToken = new RefreshToken({
        user: user._id,
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
        createdByIp: ipAddress
    });
    await refreshToken.save();

    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
};


// --- CÁC HÀM CONTROLLER ---

const signupUser = async (req, res) => {
    console.log('--- SIGNUP CONTROLLER REACHED ---');
    //console.log('Request Body:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({ name, email, password });

        // Tự động đăng nhập sau khi đăng ký
        const accessToken = generateAccessToken(user);
        await generateAndSetRefreshToken(user, req.ip, res);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        });

    } catch (error) {
        console.error('LỖI KHI ĐĂNG KÝ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');

        // --- BẮT ĐẦU LOGIC GHI LOG ---
        // Trường hợp 1: User không tồn tại hoặc sai mật khẩu
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Ghi lại hành động đăng nhập thất bại.
            // Cố gắng tìm user để lấy ID nếu có thể, giúp truy vết dễ hơn.
            const attemptedUser = user || await User.findOne({ email });
            await logActivity(
                'LOGIN_FAIL', 
                req, 
                attemptedUser ? attemptedUser._id : null, 
                `Attempt from email: ${email}`
            );
            return res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }

        // Trường hợp 2: Đăng nhập thành công
        const accessToken = generateAccessToken(user);
        await generateAndSetRefreshToken(user, req.ip, res);

        // Ghi lại hành động đăng nhập thành công
        await logActivity('LOGIN_SUCCESS', req, user._id);
        // --- KẾT THÚC LOGIC GHI LOG ---

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        });
    } catch (error) {
        console.error('LỖI KHI ĐĂNG NHẬP:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Không tìm thấy token' });

    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token }).populate('user');
        if (!refreshTokenDoc || !refreshTokenDoc.isActive) {
            return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
        }
        const { user } = refreshTokenDoc;
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken;
    
    // Nếu không có token, không cần làm gì cả.
    if (!token) {
        return res.status(200).json({ message: 'Không có session để đăng xuất' });
    }
    
    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token });
        
        if (refreshTokenDoc && refreshTokenDoc.isActive) {
            // --- BẮT ĐẦU LOGIC GHI LOG ---
            // Lấy userId từ document token tìm được
            const userId = refreshTokenDoc.user;
            
            // Thu hồi token
            refreshTokenDoc.revoked = Date.now();
            refreshTokenDoc.revokedByIp = req.ip;
            await refreshTokenDoc.save();

            // Ghi lại hành động đăng xuất
            await logActivity('LOGOUT', req, userId);
            // --- KẾT THÚC LOGIC GHI LOG ---
        }

        // Luôn xóa cookie ở client dù token có hợp lệ hay không
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Đăng xuất thành công' });

    } catch (error) {
        console.error('LỖI KHI ĐĂNG XUẤT:', error);
        // Ngay cả khi có lỗi, vẫn cố gắng xóa cookie và trả về thành công cho client
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Đã xóa session phía client, có lỗi xảy ra ở server.' });
    }
};

const getUserProfile = async (req, res) => {
    res.json(req.user);
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (req.user._id.equals(user._id)) {
            return res.status(400).json({ message: 'Admin không thể tự xóa chính mình.' });
        }
        await user.deleteOne();
        res.json({ message: 'Người dùng đã được xóa' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

const uploadAvatar = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
    try {
        const user = await User.findById(req.user.id);
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }
        const processedImageBuffer = await sharp(req.file.buffer).resize(500, 500).toFormat('webp').webp({ quality: 90 }).toBuffer();
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            uploadStream.end(processedImageBuffer);
        });
        user.avatar = { public_id: uploadResult.public_id, url: uploadResult.secure_url };
        await user.save();
        res.status(200).json({ success: true, message: 'Upload avatar thành công', avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi upload avatar' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: true, message: 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một email hướng dẫn.' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu...\n\nNhấn vào link sau để tiếp tục (hết hạn sau 10 phút):\n\n${resetUrl}`;
        await sendEmail({ email: user.email, subject: 'Yêu cầu đặt lại mật khẩu', message });
        res.status(200).json({ success: true, message: 'Email hướng dẫn đã được gửi.' });
    } catch (err) {
        console.error('LỖI KHI GỬI EMAIL RESET PASSWORD:', err);
        res.status(500).json({ message: 'Lỗi khi gửi email, vui lòng thử lại sau.' });
    }
};

const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    try {
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công.' });
    } catch (error) {
        console.error('LỖI KHI RESET PASSWORD:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
    }
};

/**
 * @desc    Lấy tất cả logs (chỉ Admin)
 * @route   GET /api/users/logs
 * @access  Private/Admin
 */
const getLogs = async (req, res) => {
    // Lấy 100 logs gần nhất, populate thông tin user
    const logs = await Log.find({}).sort({ createdAt: -1 }).limit(100).populate('user', 'name email');
    res.json(logs);
};
// --- EXPORT TẤT CẢ CÁC HÀM ---

module.exports = {
    signupUser,
    loginUser,
    refreshToken,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    uploadAvatar,
    forgotPassword,
    resetPassword,
    getLogs,
};