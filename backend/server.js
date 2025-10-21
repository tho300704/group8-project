// /backend/server.js
/*
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Giả sử bạn có file kết nối DB

dotenv.config(); // Load biến môi trường từ file .env
connectDB(); // Kết nối tới MongoDB

const app = express();

// Middleware để đọc req.body dạng JSON
app.use(express.json());

// Định nghĩa route chính
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng user routes
// Mọi request tới /api/users/... sẽ được xử lý bởi userRoutes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
// /backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Giả sử bạn có file kết nối DB

dotenv.config(); // Load biến môi trường từ file .env
console.log('JWT Secret from .env:', process.env.JWT_SECRET); 
connectDB(); // Kết nối tới MongoDB

const app = express();

// Middleware để đọc req.body dạng JSON
app.use(express.json());

// Định nghĩa route chính
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng user routes
// Mọi request tới /api/users/... sẽ được xử lý bởi userRoutes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));