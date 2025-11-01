import React, { useState } from 'react';
import api from '../api/axiosConfig';
// <<< BƯỚC THÊM: IMPORT `Link` TỪ `react-router-dom` >>>
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await api.post('/users/login', {
                email,
                password,
            });
            
            const accessToken = response.data.accessToken;
            setMessage('Đăng nhập thành công!');
            localStorage.setItem('accessToken', accessToken);
            window.dispatchEvent(new Event('loginStateChange'));

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
            
            {/* <<< BƯỚC THÊM: THÊM LINK "QUÊN MẬT KHẨU" Ở ĐÂY >>> */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
        </div>
    );
};

export default Login;