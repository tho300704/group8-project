const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' // User thực hiện hành động (có thể null nếu là login thất bại)
    },
    action: { 
        type: String,
        required: true,
        // Các loại hành động có thể được ghi lại
        enum: [
            'LOGIN_SUCCESS', 
            'LOGIN_FAIL', 
            'LOGOUT', 
            'PASSWORD_RESET_REQUEST', 
            'PASSWORD_RESET_SUCCESS',
            'AVATAR_UPDATE'
        ]
    },
    ipAddress: { 
        type: String, 
        required: true
    },
    details: { // Thêm thông tin chi tiết nếu cần
        type: String,
    },
}, { 
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;