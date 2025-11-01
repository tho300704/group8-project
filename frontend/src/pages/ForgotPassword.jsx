import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');
        try {
            const { data } = await api.post('/users/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div>
            <h2>Quên Mật Khẩu</h2>
            <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Gửi Hướng Dẫn</button>
            </form>
            {message && <p>{message}</p>}
            <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
    );
};
export default ForgotPassword;