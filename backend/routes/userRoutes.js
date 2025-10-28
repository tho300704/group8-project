const express = require('express');
const router = express.Router();

const { 
    signupUser, 
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    refreshToken,
    logoutUser,
} = require('../controllers/userController');

// Sửa lại import cho chính xác
const { protect, checkRole } = require('../middleware/authMiddleware');


// === PUBLIC ROUTES ===
// Các route này không yêu cầu xác thực
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/refresh-token', refreshToken);


// === PRIVATE ROUTES (All Authenticated Users) ===
// Các route này yêu cầu người dùng phải đăng nhập (có token hợp lệ)
router.post('/logout', protect, logoutUser); // Nên có protect để biết user nào logout
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.put('/profile/avatar', protect, uploadAvatar);


// === ADMIN & MODERATOR ROUTES ===
// Các route này yêu cầu quyền hạn cụ thể

// Lấy danh sách users (Admin & Moderator)
// Phải đặt route này trước route '/:id' để tránh Express nhầm 'profile' là một ID
router.get('/', protect, checkRole(['admin', 'moderator']), getUsers);


// === ADMIN ONLY ROUTES ===
// Các route chỉ dành cho Admin

// Quản lý user theo ID (Admin only)
router.delete('/:id', protect, checkRole(['admin']), deleteUser);


module.exports = router;