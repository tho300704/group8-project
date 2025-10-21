// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// KHÔNG CẦN DÒNG NÀY NỮA
// const API_URL = 'http://localhost:3000/api/users'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setToken('');

        try {
            // SỬA LẠI DÒNG NÀY
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                email,
                password,
            });
            
            const receivedToken = response.data.token;
            setMessage(response.data.message);
            setToken(receivedToken);

            localStorage.setItem('userToken', receivedToken);

            // setTimeout(() => navigate('/profile'), 2000);

        } catch (error) {
            // Thêm log để dễ debug khi có lỗi mạng
            console.error("Lỗi khi đăng nhập:", error); 
            setMessage(error.response?.data?.message || 'Không thể kết nối đến server. Vui lòng thử lại.');
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
            {message && <p>{message}</p>}
            {token && (
                <div>
                    <h4>JWT Token nhận được:</h4>
                    <p style={{ wordBreak: 'break-all' }}>{token}</p>
                </div>
            )}
        </div>
    );
};

export default Login;