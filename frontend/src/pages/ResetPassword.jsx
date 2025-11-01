import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { resettoken } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');
        try {
            const { data } = await api.put(`/users/reset-password/${resettoken}`, { password });
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000); // Tự động chuyển về trang login
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    return (
        <div>
            <h2>Đặt Lại Mật Khẩu Mới</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                <button type="submit">Lưu Mật Khẩu</button>
            </form>
            {message && <p>{message}</p>}
            {message.includes('thành công') && <Link to="/login">Đi đến trang Đăng nhập</Link>}
        </div>
    );
};
export default ResetPassword;