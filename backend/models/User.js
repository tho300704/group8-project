// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    select: false, // << THÊM VÀO: Mặc định không trả về trường password khi query
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'], // Thêm 'moderator'
    default: 'user',
  },
  // --- CÁC TRƯỜNG MỚI CHO HOẠT ĐỘNG 4 ---
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // ------------------------------------
}, {
  timestamps: true,
});


// Middleware: Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ mã hóa lại mật khẩu nếu nó được thay đổi
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;