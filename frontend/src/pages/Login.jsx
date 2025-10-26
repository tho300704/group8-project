// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(''); // State này chỉ dùng để demo, có thể xóa đi sau này
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setToken('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                email,
                password,
            });
            
            const receivedToken = response.data.token;
            setMessage(response.data.message);
            setToken(receivedToken);

            // 1. Lưu token vào Local Storage
            localStorage.setItem('userToken', receivedToken);

            // 2. << DÒNG THÊM VÀO >>
            // Phát ra một sự kiện để báo cho các component khác (như Navigation) biết rằng trạng thái đăng nhập đã thay đổi.
            window.dispatchEvent(new Event('loginStateChange'));

            // 3. Tự động chuyển hướng đến trang Profile sau 1 giây
            setTimeout(() => {
                navigate('/profile');
            }, 1000);

        } catch (error) {
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
            {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
            {token && (
                <div>
                    <h4 style={{marginTop: '15px'}}>JWT Token nhận được (để debug):</h4>
                    <p style={{ wordBreak: 'break-all', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>{token}</p>
                </div>
            )}
        </div>
    );
};

export default Login;