// src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// BƯỚC 1: XÓA DÒNG NÀY ĐI, CHÚNG TA SẼ DÙNG BIẾN MÔI TRƯỜNG
// const API_URL = 'http://localhost:3000/api/users';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Kiểm tra validation đơn giản
        if (!name || !email || !password) {
            setMessage('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            // BƯỚC 2: SỬA LẠI URL VÀ ENDPOINT CHO CHÍNH XÁC
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
                name,
                email,
                password,
            });

            setMessage(response.data.message || "Đăng ký thành công!"); // Lấy thông báo từ backend

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error); // Log lỗi ra console để dễ debug
            setMessage(error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div>
            <h2>Đăng Ký Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Họ và tên:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Đăng Ký</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signup;