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

const { protect, checkRole } = require('../middleware/authMiddleware');

// <<< BƯỚC 1: IMPORT MIDDLEWARE UPLOAD >>>
const upload = require('../middleware/uploadMiddleware');


// === PUBLIC ROUTES ===
// Các route này không yêu cầu xác thực
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/refresh-token', refreshToken);


// === PRIVATE ROUTES (All Authenticated Users) ===
// Các route này yêu cầu người dùng phải đăng nhập (có token hợp lệ)
router.post('/logout', protect, logoutUser); 
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// <<< BƯỚC 2: CẬP NHẬT ROUTE UPLOAD AVATAR >>>
// Thêm `upload.single('avatar')` để xử lý file trước khi vào controller
router.put('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);


// === ADMIN & MODERATOR ROUTES ===
// Lấy danh sách users (Admin & Moderator)
// Chuyển route này xuống dưới để đảm bảo thứ tự logic, mặc dù Express v5 xử lý khá tốt
// router.get('/', protect, checkRole(['admin', 'moderator']), getUsers); 
// Sửa thành router.route('/') để nhóm các method lại nếu cần mở rộng sau này
router.route('/')
    .get(protect, checkRole(['admin', 'moderator']), getUsers);


// === ADMIN ONLY ROUTES ===
// Quản lý user theo ID (Admin only)
router.delete('/:id', protect, checkRole(['admin']), deleteUser);


module.exports = router;