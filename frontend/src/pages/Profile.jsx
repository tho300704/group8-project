// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    // --- Các state cũ ---
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    // --- << BƯỚC 1: THÊM STATE CHO AVATAR >> ---
    const [avatar, setAvatar] = useState(''); // Để lưu URL avatar từ server
    const [avatarPreview, setAvatarPreview] = useState(''); // Để hiển thị ảnh ngay khi chọn
    const [uploading, setUploading] = useState(false); // Để hiển thị trạng thái đang upload
    
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:3000/api/users/profile', config);
                setUser(data);
                setName(data.name);
                setEmail(data.email);
                
                // --- << BƯỚC 2: SET AVATAR TỪ DỮ LIỆU USER >> ---
                if (data.avatar && data.avatar.url) {
                    setAvatar(data.avatar.url);
                    setAvatarPreview(data.avatar.url);
                }
                
            } catch (error) {
                console.error('Lỗi khi lấy thông tin profile:', error);
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, [token, navigate]);
    
    // --- (Hàm handleUpdate giữ nguyên) ---
    const handleUpdate = async (e) => {
        // ... code cũ không thay đổi ...
        e.preventDefault();
        setMessage('');
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            const updateData = { name, email };
            if (password) { updateData.password = password; }
            const { data } = await axios.put('http://localhost:3000/api/users/profile', updateData, config);
            setUser(data);
            localStorage.setItem('userToken', data.token);
            setMessage('Cập nhật thông tin thành công!');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    // --- << BƯỚC 3: THÊM HÀM XỬ LÝ UPLOAD AVATAR >> ---
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Hiển thị ảnh preview ngay lập tức
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setAvatarPreview(reader.result);
            setUploading(true);
            setMessage('Đang tải ảnh lên...');
            
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                
                // Gửi chuỗi base64 lên server
                const { data } = await axios.put('http://localhost:3000/api/users/profile/avatar', { avatar: reader.result }, config);
                
                if (data.success) {
                    setAvatar(data.avatar.url); // Cập nhật URL avatar mới
                    setMessage('Cập nhật avatar thành công!');
                }
            } catch (error) {
                console.error('Lỗi khi upload avatar:', error);
                setMessage(error.response?.data?.message || 'Lỗi khi upload avatar');
                setAvatarPreview(avatar); // Nếu lỗi, quay lại ảnh cũ
            } finally {
                setUploading(false);
            }
        };
    };

    if (!user) { return <div>Đang tải thông tin cá nhân...</div>; }

    return (
        <div>
            <h2>Thông Tin Cá Nhân</h2>
            
            {/* --- << BƯỚC 4: HIỂN THỊ AVATAR VÀ NÚT UPLOAD >> --- */}
            <div>
                <img 
                    src={avatarPreview || 'https://via.placeholder.com/150'} // Ảnh mặc định
                    alt="Avatar" 
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <br />
                <label htmlFor="avatar-upload">Đổi avatar</label>
                <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading} // Vô hiệu hóa nút khi đang upload
                    style={{ display: 'none' }} // Ẩn input gốc
                />
            </div>
            {uploading && <p>Đang xử lý...</p>}
            
            {/* --- Thông tin người dùng --- */}
            <div><strong>Tên:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <hr />
            
            {/* --- Form cập nhật thông tin --- */}
            <h3>Cập nhật thông tin</h3>
            <form onSubmit={handleUpdate}>
                {/* ... các input cũ không thay đổi ... */}
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