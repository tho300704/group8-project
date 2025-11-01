// src/pages/Login.jsx

import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

// Import các công cụ cần thiết từ Redux
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();
    // Khởi tạo hook `useDispatch` để có thể gửi actions
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Gọi API đăng nhập
            const response = await api.post('/users/login', {
                email,
                password,
            });
            
            // Lấy toàn bộ dữ liệu trả về từ API
            const loginData = response.data; 
            
            setMessage('Đăng nhập thành công!');

            // 1. Lưu accessToken vào Local Storage
            localStorage.setItem('accessToken', loginData.accessToken);

            // 2. Cập nhật Redux store bằng cách dispatch action `loginSuccess`
            // Truyền toàn bộ `loginData` làm payload
            dispatch(loginSuccess(loginData));

            // 3. Chuyển hướng
            setTimeout(() => {
                navigate('/profile');
            }, 1000);

        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error); 
            setMessage(error.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
        }
    };

    return (
        <div>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Đăng Nhập</button>
            </form>
            {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
            
            <div style={{ marginTop: '1rem' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
        </div>
    );
};

export default Login;