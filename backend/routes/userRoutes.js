// /backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/userController');

// Route cho đăng ký
router.post('/signup', signupUser);

// Route cho đăng nhập
router.post('/login', loginUser);

// Route cho đăng xuất không cần thiết ở backend với JWT

module.exports = router;