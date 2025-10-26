// /backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// <<< LỖI 1: Bổ sung các controller còn thiếu vào đây
const { 
    signupUser, 
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    forgotPassword,      // << ĐÃ THÊM
    resetPassword,       // << ĐÃ THÊM
    uploadAvatar,        // << ĐÃ THÊM
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// ===============================================
//              AUTH & PROFILE ROUTES
// ===============================================

// Public routes for authentication
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword); // << Đặt ở đây là hợp lý
router.put('/resetpassword/:resettoken', resetPassword); // << Đặt ở đây là hợp lý

// Private route for user profile
// Route tĩnh '/profile' được đặt ở đây, TRƯỚC các route động như '/:id'
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// <<< LỖI 2: Bổ sung route upload avatar
// Private route for avatar upload
router.put('/profile/avatar', protect, uploadAvatar);


// ===============================================
//              ADMIN ROUTES
// ===============================================

// Private/Admin route to get all users
// Đặt sau các route auth/profile nhưng trước route '/:id'
router.route('/')
    .get(protect, admin, getUsers);

// Private/Admin route to delete a user by ID
// Route động '/:id' được đặt ở CUỐI CÙNG
router.route('/:id')
    .delete(protect, admin, deleteUser);
    

module.exports = router;