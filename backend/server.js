// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import route từ file userRoutes.js
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Nạp các biến môi trường từ file .env

const app = express();
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body

// Route mặc định để kiểm tra server có đang chạy không
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Sử dụng userRoutes cho tất cả các request bắt đầu bằng /api/users
// Ví dụ: GET /api/users, POST /api/users sẽ được xử lý bởi userRoutes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
