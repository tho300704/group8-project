// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
  },
  // THÊM TRƯỜNG PASSWORD
  password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
  },
  // THÊM TRƯỜNG ROLE
  role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;