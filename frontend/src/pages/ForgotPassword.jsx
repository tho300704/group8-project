import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/users/forgotpassword', { email });
            setMessage('Email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Lỗi xảy ra');
        }
    };

    return (
        <div>
            <h2>Quên Mật Khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Gửi</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
export default ForgotPassword;