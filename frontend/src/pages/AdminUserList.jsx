import React, { useState, useEffect } from 'react';
// <<< BƯỚC 1: SỬA IMPORT - DÙNG `api` THAY CHO `axios` >>>
import api from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
// <<< BƯỚC 2: IMPORT THƯ VIỆN ĐỂ GIẢI MÃ TOKEN >>>
import { jwtDecode } from 'jwt-decode'; // <<< ĐÚNG

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // <<< BƯỚC 3: THÊM STATE ĐỂ LƯU VAI TRÒ CỦA NGƯỜI DÙNG HIỆN TẠI >>>
    const [currentUserRole, setCurrentUserRole] = useState('');

    useEffect(() => {
        // Lấy token và giải mã để lấy vai trò ngay khi component được tải
        const token = localStorage.getItem('accessToken'); // Đọc đúng tên token
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserRole(decoded.role);
            } catch (e) {
                console.error("Token không hợp lệ, đang đăng xuất...", e);
                // Xử lý token hỏng
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        }

        const fetchUsers = async () => {
            try {
                // <<< BƯỚC 4: DÙNG `api` ĐỂ GỌI API, KHÔNG CẦN CONFIG >>>
                const { data } = await api.get('/users'); // URL rút gọn vì đã có baseURL
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Bạn không có quyền truy cập trang này.');
            } finally {
                setLoading(false);
            }
        };

        if (!token) {
            navigate('/login');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                // <<< BƯỚC 5: DÙNG `api` ĐỂ GỌI API XÓA >>>
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                alert('Lỗi khi xóa người dùng: ' + (err.response?.data?.message || 'Lỗi không xác định'));
            }
        }
    };

    if (loading) return <div>Đang tải danh sách người dùng...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2>Quản Lý Người Dùng</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {/* <<< BƯỚC 6: HIỂN THỊ NÚT XÓA DỰA TRÊN VAI TRÒ >>> */}
                                {/* Chỉ render nút Xóa nếu người dùng hiện tại có vai trò là 'admin' */}
                                {currentUserRole === 'admin' && (
                                    <button onClick={() => handleDelete(user._id)} className="delete-button">
                                        Xóa
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;