// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser, // Import hàm mới
  deleteUser, // Import hàm mới
} = require('../controllers/userController');

// Route cho GET và POST
router.route('/').get(getUsers).post(createUser);

// Route cho PUT và DELETE, cần có ID
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;