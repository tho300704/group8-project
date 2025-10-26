import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { resettoken } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/users/resetpassword/${resettoken}`, { password });
            setMessage('Mật khẩu đã được đặt lại thành công!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Lỗi xảy ra');
        }
    };

    return (
        <div>
            <h2>Đặt Lại Mật Khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Lưu Mật Khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
export default ResetPassword;