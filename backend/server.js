// /backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();


// ==========================================================
// ======   BẮT ĐẦU PHẦN CẬP NHẬT CHO DEPLOYMENT   ======
// ==========================================================

// 1. Tạo một danh sách các nguồn gốc được phép (allowed origins)
const allowedOrigins = [
    'http://localhost:3001', // Cho môi trường development (React)
    process.env.FRONTEND_URL  // URL của frontend trên Vercel, lấy từ biến môi trường
];

// 2. Cấu hình CORS để sử dụng danh sách này
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các request không có origin (ví dụ: mobile apps, Postman/Thunder Client)
        if (!origin) return callback(null, true);
        
        // Nếu origin của request nằm trong danh sách cho phép, cho phép nó
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Cho phép gửi và nhận cookie
}));


// ==========================================================
// ======   KẾT THÚC PHẦN CẬP NHẬT CHO DEPLOYMENT   ======
// ==========================================================


// Middleware để đọc req.body dạng JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 

// Định nghĩa route chính
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng user routes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));