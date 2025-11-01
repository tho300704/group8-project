// /backend/controllers/userController.js

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp');

// --- CÁC HÀM XÁC THỰC VÀ QUẢN LÝ TOKEN ---
// ... (Tất cả các hàm từ signupUser đến deleteUser đều giữ nguyên, không thay đổi)
const generateAccessToken = (user) => { /* ... */ };
const generateAndSetRefreshToken = async (user, ipAddress, res) => { /* ... */ };
const signupUser = async (req, res) => { /* ... */ };
const loginUser = async (req, res) => { /* ... */ };
const refreshToken = async (req, res) => { /* ... */ };
const logoutUser = async (req, res) => { /* ... */ };
const getUserProfile = async (req, res) => { /* ... */ };
const updateUserProfile = async (req, res) => { /* ... */ };
const getUsers = async (req, res) => { /* ... */ };
const deleteUser = async (req, res) => { /* ... */ };
const uploadAvatar = async (req, res) => { /* ... */ };


// ==========================================================
// ====== BẮT ĐẦU PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 4 (PASSWORD RESET) ======
// ==========================================================

/**
 * @desc    Xử lý yêu cầu quên mật khẩu
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Để tăng cường bảo mật, chúng ta không báo lỗi "không tìm thấy email".
        // Dù có tìm thấy hay không, vẫn trả về thông báo thành công chung chung.
        // Điều này ngăn kẻ tấn công dò xem email nào đã tồn tại trong hệ thống.
        if (!user) {
            return res.status(200).json({ 
                success: true, 
                message: 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một email hướng dẫn đặt lại mật khẩu.' 
            });
        }

        // 1. Tạo một token reset (là một chuỗi ngẫu nhiên, an toàn)
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Băm token này bằng SHA256 và lưu vào DB.
        // Chúng ta không bao giờ lưu token gốc vào DB.
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // 3. Đặt thời gian hết hạn cho token là 10 phút kể từ bây giờ.
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false }); // Bỏ qua validation khi lưu
        // 4. Tạo URL reset mà người dùng sẽ click vào trong email.
        // URL này chứa token gốc (chưa băm).
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\nVui lòng nhấn vào link sau để đặt lại mật khẩu (link sẽ hết hạn sau 10 phút):\n\n${resetUrl}\n\nNếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.`;

        // 5. Gửi email
        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            message,
        });

        res.status(200).json({ success: true, message: 'Email hướng dẫn đã được gửi.' });

    } catch (err) {
        console.error('LỖI KHI GỬI EMAIL RESET PASSWORD:', err);
        // Trong trường hợp gửi email thất bại, xóa token đã tạo ra khỏi DB.
        // Logic này cần được cải thiện để đảm bảo user có thể thử lại.
        // Tạm thời chỉ log lỗi và báo lỗi server.
        res.status(500).json({ message: 'Lỗi khi gửi email, vui lòng thử lại sau.' });
    }
};


/**
 * @desc    Đặt lại mật khẩu mới bằng token
 * @route   PUT /api/users/reset-password/:resettoken
 * @access  Public
 */
const resetPassword = async (req, res) => {
    // 1. Lấy token gốc từ URL params và băm nó lại.
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    try {
        // 2. Tìm user trong DB có token đã băm khớp VÀ token chưa hết hạn.
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // 3. Cập nhật mật khẩu mới và xóa các trường token.
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save(); // pre-save hook sẽ tự động hash mật khẩu mới.

        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công.' });
    
    } catch (error) {
        console.error('LỖI KHI RESET PASSWORD:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
    }
};

// ==========================================================
// ======  KẾT THÚC PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 4   ======
// ==========================================================


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
    forgotPassword, // Đảm bảo export
    resetPassword,  // Đảm bảo export
};