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

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        // BƯỚC QUAN TRỌNG: IN LỖI CHI TIẾT RA CONSOLE CỦA SERVER
        console.error('!!!!!!!!!! LỖI KHI ĐĂNG KÝ !!!!!!!!!!');
        console.error(error); // In ra toàn bộ đối tượng lỗi

        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};


// ==========================================================
// ======   BẮT ĐẦU PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 2   ======
// ==========================================================

/**
 * @desc    Lấy thông tin cá nhân của người dùng đã đăng nhập
 * @route   GET /api/users/profile
 * @access  Private (Yêu cầu đăng nhập)
 */
const getUserProfile = async (req, res) => {
    // Middleware 'protect' đã chạy trước và gắn `req.user` vào request.
    // Chúng ta chỉ cần trả về thông tin đó.
    // `req.user` đã được loại bỏ mật khẩu bởi middleware.
    res.json(req.user);
};

/**
 * @desc    Cập nhật thông tin cá nhân của người dùng
 * @route   PUT /api/users/profile
 * @access  Private (Yêu cầu đăng nhập)
 */
const updateUserProfile = async (req, res) => {
    // Lấy user từ DB để đảm bảo chúng ta đang làm việc với dữ liệu mới nhất.
    const user = await User.findById(req.user._id);

    if (user) {
        // Cập nhật tên và email nếu chúng được cung cấp trong body.
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Nếu người dùng gửi lên mật khẩu mới, cập nhật nó.
        if (req.body.password) {
            // Chỉ cần gán mật khẩu mới.
            // Schema's pre-save hook sẽ tự động mã hóa nó trước khi lưu.
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Trả về thông tin user đã được cập nhật cùng với một token mới.
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};


// ==========================================================
// ======   KẾT THÚC PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 2   ======
// ==========================================================


module.exports = {
    signupUser,
    loginUser,
    getUserProfile,   // << Thêm vào đây
    updateUserProfile,// << Thêm vào đây
};