import React, { useState } from 'react';
// <<< BƯỚC SỬA 1: DÙNG `api` THAY CHO `axios` >>>
import api from '../api/axiosConfig'; // Đảm bảo đường dẫn này đúng
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // <<< BƯỚC SỬA 2: GỌI API BẰNG `api` >>>
            // `withCredentials: true` đã được cấu hình trong `axiosConfig`,
            // nó sẽ tự động nhận và lưu `refreshToken` cookie.
            const response = await api.post('/users/login', {
                email,
                password,
            });
            
            // <<< BƯỚC SỬA 3: LƯU ĐÚNG TÊN TOKEN >>>
            // Backend trả về `accessToken`, chúng ta sẽ lưu nó với tên `accessToken`.
            const accessToken = response.data.accessToken;
            setMessage('Đăng nhập thành công!');

            // Lưu accessToken vào Local Storage. Interceptor sẽ sử dụng nó.
            localStorage.setItem('accessToken', accessToken);

            // Phát sự kiện để báo cho Navigation biết đã đăng nhập thành công.
            window.dispatchEvent(new Event('loginStateChange'));

            // Tự động chuyển hướng đến trang Profile sau 1 giây.
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
            
            {/* Không cần hiển thị token trong UI nữa vì nó đã hoạt động tự động */}
        </div>
    );
};

export default Login;