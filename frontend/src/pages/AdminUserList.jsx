// src/pages/AdminUserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:3000/api/users', config);
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Bạn không có quyền truy cập trang này.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token, navigate]);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:3000/api/users/${userId}`, config);
                // Cập nhật lại danh sách user trên UI sau khi xóa thành công
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
            <h2>Quản Lý Người Dùng (Admin)</h2>
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
                                <button onClick={() => handleDelete(user._id)} className="delete-button">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;