// controllers/userController.js
let users = [
  { id: 1, name: 'Nguyễn Phước Thọ', email: 'tho.np@example.com' },
  { id: 2, name: 'Lê Đức Thịnh', email: 'thinh.ld@example.com' },
];

// @desc    Lấy tất cả user
// @route   GET /api/users
const getUsers = (req, res) => {
  res.json(users);
};

// @desc    Tạo user mới
// @route   POST /api/users
const createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };
  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };