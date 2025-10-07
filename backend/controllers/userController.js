// backend/controllers/userController.js
const User = require('../models/User');

// GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// POST /api/users
const createUser = async (req, res) => {
  const { name, email } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
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

module.exports = { getUsers, createUser };