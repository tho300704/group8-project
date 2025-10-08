// backend/controllers/userController.js

const User = require('../models/User');

// --- CÁC HÀM getUSERS VÀ createUser GIỮ NGUYÊN ---

// @desc    Lấy tất cả user
// @route   GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Tạo user mới
// @route   POST /api/users
const createUser = async (req, res) => {
  const { name, email } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// --- THÊM CODE MỚI TẠI ĐÂY ---

// @desc    Cập nhật thông tin user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Xóa user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


module.exports = {
  getUsers,
  createUser,
  updateUser, // Thêm export
  deleteUser, // Thêm export
};