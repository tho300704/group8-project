const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 5, // Cho phép tối đa 5 request mỗi IP trong 1 phút
    message: { message: 'Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 1 phút.' },
    standardHeaders: true, // Trả về thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // Tắt các header cũ `X-RateLimit-*`
});
// --- Import Controllers ---
const { 
    signupUser, 
    loginUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
    getUsers,
    deleteUser,
} = require('../controllers/userController');

// --- Import Middlewares ---
const { protect, checkRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// ===============================================
// ===           1. PUBLIC ROUTES            ===
// ===============================================
// Không yêu cầu xác thực

router.post('/signup', signupUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// ===============================================
// ===      2. AUTHENTICATED USER ROUTES     ===
// ===============================================
// Yêu cầu đăng nhập (dùng middleware `protect`)

router.post('/logout', protect, logoutUser); 

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Middleware `upload.single('avatar')` sẽ xử lý file trước khi vào controller `uploadAvatar`
router.put('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);


// ===============================================
// ===          3. ADMIN/MOD ROUTES          ===
// ===============================================
// Yêu cầu đăng nhập và có vai trò cụ thể (dùng `protect` và `checkRole`)

// Lấy danh sách tất cả users (Admin & Moderator)
router.get('/', protect, checkRole(['admin', 'moderator']), getUsers);

// Xóa một user (Chỉ Admin)
router.delete('/:id', protect, checkRole(['admin']), deleteUser);

router.get('/logs', protect, checkRole(['admin']), getLogs);

module.exports = router;