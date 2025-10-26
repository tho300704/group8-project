// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <<< BƯỚC 1: IMPORT BCRYPTJS

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true, // Đảm bảo email là duy nhất
    match: [/\S+@\S+\.\S+/, 'Email không hợp lệ'], // Thêm validation cho email
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6, // Thêm yêu cầu độ dài tối thiểu
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true,
});

// <<< BƯỚC 2: THÊM MIDDLEWARE ĐỂ MÃ HÓA MẬT KHẨU
userSchema.pre('save', async function (next) {
  // Chỉ chạy hàm này nếu mật khẩu đã được thay đổi (hoặc là user mới)
  if (!this.isModified('password')) {
    return next();
  }

  // Băm mật khẩu với salt factor là 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;