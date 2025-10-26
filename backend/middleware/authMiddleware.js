const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

/**
 * Middleware để bảo vệ các route yêu cầu đăng nhập.
 * Nó sẽ kiểm tra token trong header, giải mã và gắn thông tin user
 * vào đối tượng `req` để các controller sau đó có thể sử dụng.
 */
const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Lấy token từ header (loại bỏ chữ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Xác thực và giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Lấy thông tin user từ ID trong token và gắn vào req
            // Dùng .select('-password') để loại bỏ trường password khỏi kết quả trả về
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Không tìm thấy người dùng cho token này' });
            }

            next(); // Nếu mọi thứ ổn, cho phép request đi tiếp
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Xác thực thất bại, token không hợp lệ' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Xác thực thất bại, không tìm thấy token' });
    }
};
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin, cho đi tiếp
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập. Yêu cầu quyền Admin.' });
    }
};
module.exports = { protect, admin };