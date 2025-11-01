const multer = require('multer');

// Cấu hình lưu trữ file trong bộ nhớ (memory storage)
// Chúng ta không lưu file vào đĩa server, mà xử lý trực tiếp trong RAM
const storage = multer.memoryStorage();

// Cấu hình filter để chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Giới hạn kích thước file 2MB
});

module.exports = upload;