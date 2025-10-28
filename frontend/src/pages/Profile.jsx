// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
// <<< BƯỚC SỬA 1: BỎ `import axios from 'axios';` VÀ CHỈ DÙNG `api` >>>
import api from '../api/axiosConfig'; // Đảm bảo đường dẫn này đúng
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
    // Bỏ `token` vì interceptor sẽ tự xử lý
    // const token = localStorage.getItem('userToken'); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // <<< BƯỚC SỬA 2: DÙNG `api` THAY CHO `axios` >>>
                // Không cần truyền config nữa, interceptor sẽ tự thêm token
                const { data } = await api.get('/users/profile');
                
                setUser(data);
                setName(data.name);
                setEmail(data.email);
                
                if (data.avatar && data.avatar.url) {
                    setAvatar(data.avatar.url);
                    setAvatarPreview(data.avatar.url);
                }
                
            } catch (error) {
                // Interceptor đã xử lý việc chuyển hướng nếu lỗi 401,
                // nhưng chúng ta vẫn có thể log lỗi để debug
                console.error('Không thể lấy thông tin profile, có thể token đã hết hạn hoàn toàn.', error);
            }
        };

        // Kiểm tra token ở client trước khi gọi API để tránh request thừa
        if (localStorage.getItem('accessToken')) {
             fetchUserProfile();
        } else {
            navigate('/login');
        }
       
    }, [navigate]); // Bỏ `token` khỏi dependency array
    
    // --- (Hàm handleUpdate đã được sửa) ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // <<< BƯỚC SỬA 3: DÙNG `api` THAY CHO `axios` >>>
            const updateData = { name, email };
            if (password) { updateData.password = password; }

            const { data } = await api.put('/users/profile', updateData);
            
            setUser(data);
            // API Profile không trả về token mới trong cấu trúc Refresh Token, nên không cần cập nhật
            // localStorage.setItem('userToken', data.token);
            setMessage('Cập nhật thông tin thành công!');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    // --- (Hàm handleAvatarChange đã được sửa) ---
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setAvatarPreview(reader.result);
            setUploading(true);
            setMessage('Đang tải ảnh lên...');
            
            try {
                // <<< BƯỚC SỬA 4: DÙNG `api` THAY CHO `axios` >>>
                const { data } = await api.put('/users/profile/avatar', { avatar: reader.result });
                
                if (data.success) {
                    setAvatar(data.avatar.url);
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
                <label htmlFor="avatar-upload" className="custom-file-upload">Đổi avatar</label>
                <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </div>
            {uploading && <p>Đang xử lý...</p>}
            
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