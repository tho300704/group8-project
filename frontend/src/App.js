// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser'; // <-- QUAN TRỌNG: Import component EditUser mới

import './App.css';

// URL API của backend - ĐÃ CẬP NHẬT theo code bạn vừa cung cấp
const API_URL = 'http://localhost:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // <-- THÊM: State để lưu người dùng đang chỉnh sửa

  // Hàm để lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm để xử lý việc thêm user mới
  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post(API_URL, newUser);
      // Cập nhật lại danh sách user trên giao diện
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  // --- THÊM: Hàm xử lý XÓA người dùng ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // Gửi yêu cầu DELETE đến backend
      setUsers(users.filter(user => (user._id || user.id) !== id)); // Cập nhật state (loại bỏ người dùng đã xóa)

      // Nếu người dùng bị xóa là người đang được chỉnh sửa, hãy xóa trạng thái chỉnh sửa
      if (editingUser && (editingUser._id || editingUser.id) === id) {
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
    }
  };

  // --- THÊM: Hàm xử lý khi nhấn nút "Sửa" ---
  const handleEdit = (user) => {
    setEditingUser(user); // Đặt người dùng này vào state để hiển thị form sửa
  };

  // --- THÊM: Hàm xử lý khi form sửa được submit ---
  const handleUpdateUser = async (updatedUser) => {
    try {
      const id = updatedUser._id || updatedUser.id; // Lấy ID của người dùng
      const response = await axios.put(`${API_URL}/${id}`, updatedUser); // Gửi yêu cầu PUT đến backend
      setUsers(users.map(user =>
        (user._id || user.id) === id ? response.data : user // Cập nhật người dùng trong danh sách
      ));
      setEditingUser(null); // Xóa trạng thái chỉnh sửa để quay lại form thêm
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
    }
  };

  // --- THÊM: Hàm xử lý khi nhấn nút "Hủy" trong form sửa ---
  const handleCancelEdit = () => {
    setEditingUser(null); // Xóa trạng thái chỉnh sửa
  };

  return (
    <div className="App">
      <h1>Quản lý người dùng</h1>

      {/* RENDER CÓ ĐIỀU KIỆN: Hiển thị form AddUser hoặc EditUser */}
      {editingUser ? (
        <EditUser
          user={editingUser}
          onUpdateUser={handleUpdateUser}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <AddUser onAddUser={handleAddUser} />
      )}

      {/* Truyền các hàm onEdit và onDelete xuống UserList */}
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;