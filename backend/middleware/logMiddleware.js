const Log = require('../models/Log');

/**
 * Hàm ghi lại hoạt động của người dùng
 * @param {String} action - Loại hành động (ví dụ: 'LOGIN_SUCCESS')
 * @param {Object} req - Đối tượng request của Express
 * @param {String} [userId=null] - ID của người dùng (nếu có)
 * @param {String} [details=''] - Thông tin chi tiết thêm
 */
const logActivity = async (action, req, userId = null, details = '') => {
    try {
        await Log.create({
            action,
            ipAddress: req.ip,
            user: userId,
            details,
        });
    } catch (error) {
        console.error('Lỗi khi ghi log hoạt động:', error);
    }
};

module.exports = logActivity;