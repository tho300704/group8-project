// /backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Giả sử bạn có file kết nối DB
const cors = require('cors');
dotenv.config(); // Load biến môi trường từ file .env
console.log('JWT Secret from .env:', process.env.JWT_SECRET); 
const cookieParser = require('cookie-parser');
connectDB(); // Kết nối tới MongoDB

const app = express();

app.use(cors({
    origin: 'http://localhost:3001', // Chỉ định rõ nguồn gốc của frontend
    credentials: true // <<< Rất quan trọng: Cho phép gửi cookie
}));
// Middleware để đọc req.body dạng JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 

// Định nghĩa route chính
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng user routes
// Mọi request tới /api/users/... sẽ được xử lý bởi userRoutes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));