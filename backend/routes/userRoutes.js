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
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// ===============================================
//              AUTH & PROFILE ROUTES
// ===============================================

// Public routes for authentication
router.post('/signup', signupUser);
router.post('/login', loginUser);

// Private route for user profile
// Route tĩnh '/profile' được đặt ở đây, TRƯỚC các route động như '/:id'
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

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