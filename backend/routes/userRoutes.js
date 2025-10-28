// /backend/routes/userRoutes.js

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

const { protect, admin } = require('../middleware/authMiddleware');

// ===============================================
//              AUTH & USER ROUTES (PUBLIC & PRIVATE)
// ===============================================

// Public routes for authentication and password management
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword); // :resettoken là động nhưng nó nằm trong ngữ cảnh /resetpassword nên an toàn

// Routes for session management
router.post('/refresh-token', refreshToken); // <<< ĐƯA LÊN TRÊN
router.post('/logout', logoutUser);         // <<< ĐƯA LÊN TRÊN

// Private routes for user profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/profile/avatar', protect, uploadAvatar);

// ===============================================
//              ADMIN ROUTES
// ===============================================

// Admin route to get all users (phải đứng trước route động /:id)
router.route('/')
    .get(protect, admin, getUsers);

// Admin route to manage a specific user by ID (đặt ở cuối cùng)
router.route('/:id')
    .delete(protect, admin, deleteUser);
    // Bạn cũng có thể thêm các phương thức khác ở đây sau này, ví dụ:
    // .get(protect, admin, getUserById)
    // .put(protect, admin, updateUserByAdmin)

module.exports = router;