// /backend/controllers/userController.js

const User = require('../models/User'); // Đảm bảo đường dẫn đúng
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm trợ giúp để tạo token -> Tránh lặp code
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token hết hạn sau 1 ngày
    });
};

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/users/signup
 * @access  Public
 */
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    // --- Yêu cầu 1: Nhận name, email, password ---
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // --- Yêu cầu 2: Kiểm tra email đã tồn tại ---
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // --- Yêu cầu 3: Mã hóa mật khẩu ---
        // Lưu ý: Nếu bạn cấu hình pre-save hook trong Model (do Thọ làm),
        // bạn không cần hash ở đây. Model sẽ tự động làm.
        // Dưới đây là cách làm trực tiếp nếu không có hook.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Yêu cầu 4: Lưu user mới vào DB ---
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Đăng ký xong trả token luôn
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    // --- Yêu cầu 1: Nhận email, password ---
    const { email, password } = req.body;

    try {
        // --- Yêu cầu 2: Tìm user trong DB theo email ---
        const user = await User.findOne({ email });

        // --- Yêu cầu 3 & 4: So sánh mật khẩu và tạo token ---
        if (user && (await bcrypt.compare(password, user.password))) {
            // So sánh thành công
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Trả về token
            });
        } else {
            // User không tồn tại hoặc sai mật khẩu
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};


module.exports = {
    signupUser,
    loginUser,
};