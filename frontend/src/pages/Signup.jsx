// src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Xóa thông báo cũ mỗi khi submit

        // --- VALIDATION PHÍA CLIENT ---
        if (!name || !email || !password) {
            setMessage('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        // <<< THÊM VÀO: KIỂM TRA ĐỘ DÀI MẬT KHẨU >>>
        if (password.length < 6) {
            setMessage('Mật khẩu phải có ít nhất 6 ký tự.');
            return; // Dừng thực thi nếu mật khẩu không hợp lệ
        }
        // --- KẾT THÚC VALIDATION ---

        try {
            // Sử dụng biến môi trường để gọi API
            const API_BASE_URL = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${API_BASE_URL}/api/users/signup`, {
                name,
                email,
                password,
            });

            // Lấy token và lưu vào Local Storage ngay sau khi đăng ký thành công
            // Giúp người dùng không cần phải đăng nhập lại
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            
            setMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng...");

            // Chuyển hướng đến trang Profile sau khi đăng ký và lưu token
            setTimeout(() => {
                navigate('/profile'); 
            }, 2000);

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            
            // Xử lý lỗi một cách chi tiết hơn
            if (error.response) {
                // Lỗi có phản hồi từ server (ví dụ: email đã tồn tại)
                setMessage(error.response.data.message || 'Đã có lỗi xảy ra.');
            } else if (error.request) {
                // Lỗi request được gửi đi nhưng không nhận được phản hồi
                setMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền.');
            } else {
                // Lỗi khác
                setMessage('Đã có lỗi xảy ra trong quá trình gửi yêu cầu.');
            }
        }
    };

    return (
        <div>
            <h2>Đăng Ký Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Họ và tên:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Mật khẩu (tối thiểu 6 ký tự):</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Đăng Ký</button>
            </form>
            {/* Hiển thị thông báo, có thể thêm class CSS để phân biệt thành công/thất bại */}
            {message && <p className="form-message">{message}</p>}
        </div>
    );
};

export default Signup;