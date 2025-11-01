// /backend/controllers/userController.js

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp'); // <<< BƯỚC 1: IMPORT THƯ VIỆN SHARP

// --- CÁC HÀM XÁC THỰC VÀ QUẢN LÝ TOKEN (Giữ nguyên từ Hoạt động 1 & 2) ---

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '15m',
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

const signupUser = async (req, res) => {
    // ... (Code giữ nguyên)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }
        const user = await User.create({ name, email, password });
        if (user) {
            const accessToken = generateAccessToken(user);
            await generateAndSetRefreshToken(user, req.ip, res);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        console.error('LỖI KHI ĐĂNG KÝ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const loginUser = async (req, res) => {
    // ... (Code giữ nguyên)
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const accessToken = generateAccessToken(user);
            await generateAndSetRefreshToken(user, req.ip, res);
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
        console.error('LỖI KHI ĐĂNG NHẬP:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const refreshToken = async (req, res) => {
    // ... (Code giữ nguyên)
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
    // ... (Code giữ nguyên)
    const token = req.cookies.refreshToken;
    if (!token) return res.status(204).send();
    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token });
        if (refreshTokenDoc) {
            refreshTokenDoc.revoked = Date.now();
            refreshTokenDoc.revokedByIp = req.ip;
            await refreshTokenDoc.save();
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const getUserProfile = async (req, res) => {
    // ... (Code giữ nguyên)
    res.json(req.user);
};

const updateUserProfile = async (req, res) => {
    // ... (Code giữ nguyên)
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

// --- CÁC HÀM QUẢN LÝ ADMIN (Giữ nguyên từ Hoạt động 2) ---

const getUsers = async (req, res) => {
    // ... (Code giữ nguyên)
    const users = await User.find({});
    res.json(users);
};

const deleteUser = async (req, res) => {
    // ... (Code giữ nguyên)
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

// ==========================================================
// ====== BẮT ĐẦU PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 3 (AVATAR) ======
// ==========================================================

/**
 * @desc    Upload avatar cho người dùng (Nâng cao với Multer + Sharp)
 * @route   PUT /api/users/profile/avatar
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
    // Middleware `upload.single('avatar')` sẽ xử lý file và gắn nó vào `req.file`.
    // Nếu không có file, `req.file` sẽ là undefined.
    if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn một file ảnh để tải lên.' });
    }

    try {
        // Tìm user hiện tại từ `req.user` (đã được middleware `protect` gắn vào).
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Nếu user đã có avatar cũ, chúng ta cần xóa nó khỏi Cloudinary để tránh rác.
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Dùng Sharp để xử lý ảnh từ buffer mà Multer cung cấp (req.file.buffer).
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize(500, 500) // Resize ảnh thành kích thước vuông 500x500 pixels.
            .toFormat('webp') // Chuyển đổi định dạng ảnh sang WebP để tối ưu cho web.
            .webp({ quality: 90 }) // Đặt chất lượng ảnh WebP là 90%.
            .toBuffer(); // Chuyển kết quả xử lý thành một buffer mới.

        // Upload buffer ảnh đã xử lý lên Cloudinary.
        // Chúng ta dùng một Promise để xử lý stream upload.
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'group8_avatars', // Lưu vào một thư mục riêng trên Cloudinary.
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(processedImageBuffer);
        });

        // Cập nhật thông tin avatar mới vào document của user trong DB.
        user.avatar = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
        };
        await user.save(); // Lưu lại thay đổi.

        // Trả về response thành công cho client.
        res.status(200).json({
            success: true,
            message: 'Upload avatar thành công',
            avatar: user.avatar, // Gửi lại thông tin avatar mới.
        });

    } catch (error) {
        console.error('LỖI KHI UPLOAD AVATAR:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xử lý upload avatar.' });
    }
};

// ==========================================================
// ======  KẾT THÚC PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 3   ======
// ==========================================================


// --- CÁC HÀM QUÊN MẬT KHẨU (Nếu đã làm, giữ nguyên) ---

const forgotPassword = async (req, res) => {
    // ...
};

const resetPassword = async (req, res) => {
    // ...
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
    uploadAvatar, // Đảm bảo hàm này được export
    forgotPassword,
    resetPassword,
};