// /backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import thêm các hàm controller mới
const { 
    signupUser, 
    loginUser,
    getUserProfile,       // << MỚI
    updateUserProfile     // << MỚI
} = require('../controllers/userController');

// 2. Import middleware bảo vệ
const { protect } = require('../middleware/authMiddleware'); // << MỚI

// ===============================================
//              PUBLIC ROUTES
// Các route này bất kỳ ai cũng có thể truy cập
// ===============================================
router.post('/signup', signupUser);
router.post('/login', loginUser);

// ===============================================
//              PRIVATE ROUTES
// Các route này yêu cầu người dùng phải đăng nhập
// và gửi kèm JWT token hợp lệ.
// ===============================================

// 3. Định nghĩa các route mới và áp dụng middleware 'protect'
// Sử dụng router.route() để nhóm các request cho cùng endpoint '/profile'
router.route('/profile')
    .get(protect, getUserProfile)      // Áp dụng 'protect' cho GET request
    .put(protect, updateUserProfile);  // Áp dụng 'protect' cho PUT request


module.exports = router;