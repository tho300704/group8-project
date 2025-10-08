import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm'; // Import UserForm

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Người dùng đang được chỉnh sửa

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/users');
    setUsers(response.data);
  };

  const handleDelete = async (id) => {
    // ... (như đã định nghĩa ở Bước 2)
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert('Người dùng đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Đã xảy ra lỗi khi xóa người dùng.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Đặt người dùng này vào trạng thái chỉnh sửa
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser);
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      setEditingUser(null); // Thoát khỏi chế độ chỉnh sửa sau khi cập nhật
      alert('Người dùng đã được cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert('Đã xảy ra lỗi khi cập nhật người dùng.');
    }
  };

  return (
    <div>
      <h2>Danh sách Người dùng</h2>
      {editingUser && (
        // Chỉ hiển thị UserForm khi có người dùng đang được chỉnh sửa
        // userToEdit truyền dữ liệu người dùng để form điền sẵn
        // onSubmit được gọi khi form gửi, để cập nhật người dùng
        <UserForm userToEdit={editingUser} onSubmit={handleUpdate} />
      )}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>Sửa</button>
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '5px' }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;