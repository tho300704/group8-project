import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    // State để lưu thông tin user
    const [user, setUser] = useState(null);
    // State cho các trường trong form cập nhật
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State để hiển thị thông báo (thành công hoặc thất bại)
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    // Lấy token từ Local Storage để xác thực
    const token = localStorage.getItem('userToken');

    // Dùng useEffect để gọi API lấy thông tin profile khi component được render
    useEffect(() => {
        const fetchUserProfile = async () => {
            // Kịch bản 1: Nếu không có token, người dùng chưa đăng nhập
            if (!token) {
                console.log("Không tìm thấy token, đang chuyển hướng đến trang đăng nhập...");
                navigate('/login');
                return;
            }

            try {
                // Tạo header chứa token để gửi kèm request
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                
                // Gọi API GET /profile
                const { data } = await axios.get('http://localhost:3000/api/users/profile', config);
                
                // Lưu thông tin user vào state
                setUser(data);
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin profile:', error);
                // Nếu token không hợp lệ, server sẽ trả về lỗi 401
                localStorage.removeItem('userToken'); // Xóa token hỏng
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, [token, navigate]);

    // Hàm xử lý khi người dùng nhấn nút "Cập nhật"
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const updateData = { name, email };
            if (password) { // Chỉ thêm mật khẩu vào body nếu người dùng có nhập
                updateData.password = password;
            }
            
            // Gọi API PUT /profile để cập nhật
            const { data } = await axios.put('http://localhost:3000/api/users/profile', updateData, config);
            
            setUser(data); // Cập nhật lại thông tin user trên UI
            localStorage.setItem('userToken', data.token); // Lưu lại token mới
            setMessage('Cập nhật thông tin thành công!');
            setPassword(''); // Reset trường mật khẩu

        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };
    
    // Hiển thị trạng thái "Đang tải..." trong khi chờ API
    if (!user) {
        return <div>Đang tải thông tin cá nhân...</div>;
    }

    // Giao diện chính của trang Profile
    return (
        <div>
            <h2>Thông Tin Cá Nhân</h2>
            <div>
                <strong>Tên:</strong> {user.name}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            
            <hr />
            
            <h3>Cập nhật thông tin</h3>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Tên:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Mật khẩu mới (bỏ trống nếu không đổi):</label>
                    <input type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Cập nhật</button>
            </form>
            {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Profile;