const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Liên kết tới model User
        required: true 
    },
    token: { 
        type: String, 
        required: true,
        unique: true // Mỗi token là duy nhất
    },
    expires: { 
        type: Date, 
        required: true // Thời gian token hết hạn
    },
    createdByIp: { 
        type: String, // IP của client đã tạo token này
        required: true
    },
    revoked: Date, // Ngày token bị thu hồi (khi logout)
    revokedByIp: String, // IP của client đã thu hồi
});

// Middleware để kiểm tra xem token có đang hoạt động hay không
refreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;