// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    // --- Các state (giữ nguyên) ---
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                
                setUser(data);
                setName(data.name);
                setEmail(data.email);
                
                if (data.avatar && data.avatar.url) {
                    setAvatar(data.avatar.url);
                    setAvatarPreview(data.avatar.url);
                }
                
            } catch (error) {
                console.error('Không thể lấy thông tin profile, có thể token đã hết hạn hoàn toàn.', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
             fetchUserProfile();
        } else {
            navigate('/login');
        }
       
    }, [navigate]);
    
    // --- Hàm handleUpdate (giữ nguyên) ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const updateData = { name, email };
            if (password) { updateData.password = password; }

            const { data } = await api.put('/users/profile', updateData);
            
            setUser(data);
            setMessage('Cập nhật thông tin thành công!');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    // ==========================================================
    // ======   BẮT ĐẦU PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 3   ======
    // ==========================================================
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Hiển thị ảnh preview ngay lập tức bằng cách tạo một URL tạm thời
        setAvatarPreview(URL.createObjectURL(file));
        
        // 2. Tạo đối tượng FormData để gói file lại
        const formData = new FormData();
        // 'avatar' phải khớp với tên field mà Multer đang lắng nghe ở backend
        formData.append('avatar', file); 

        setUploading(true);
        setMessage('Đang tải ảnh lên...');

        try {
            // 3. Cấu hình header cho 'multipart/form-data'
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            // 4. Gửi FormData lên server
            const { data } = await api.put('/users/profile/avatar', formData, config);

            if (data.success) {
                // Cập nhật lại state avatar với URL thật từ Cloudinary
                setAvatar(data.avatar.url); 
                setMessage('Cập nhật avatar thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi upload avatar:', error);
            setMessage(error.response?.data?.message || 'Lỗi khi upload avatar');
            // Nếu có lỗi, trả lại ảnh preview về ảnh cũ
            setAvatarPreview(avatar); 
        } finally {
            setUploading(false);
        }
    };
    // ==========================================================
    // ======    KẾT THÚC PHẦN CẬP NHẬT CHO HOẠT ĐỘNG 3   ======
    // ==========================================================

    if (!user) { return <div>Đang tải thông tin cá nhân...</div>; }

    return (
        // Phần JSX giữ nguyên, không cần thay đổi
        <div>
            <h2>Thông Tin Cá Nhân</h2>
            <div>
                <img 
                    src={avatarPreview || 'https://via.placeholder.com/150'}
                    alt="Avatar" 
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <br />
                {/* Thêm class để có thể CSS cho đẹp hơn */}
                <label htmlFor="avatar-upload" className="custom-file-upload">
                    {uploading ? 'Đang tải...' : 'Đổi avatar'}
                </label>
                <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </div>
            {/* Không cần dòng <p>Đang xử lý...</p> nữa vì đã tích hợp vào label */}
            
            <div><strong>Tên:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
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
                <button type="submit" disabled={uploading}>Cập nhật thông tin</button>
            </form>
            
            {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Profile;