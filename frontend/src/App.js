// src/App.js
import React, { useState, useEffect } from 'react'; // <-- Đảm bảo useState và useEffect được nhập từ React
import axios from 'axios'; // <-- Đảm bảo axios được nhập

import UserList from './components/UserList'; // <-- Đảm bảo UserList được nhập đúng đường dẫn
import AddUser from './components/AddUser';   // <-- Đảm bảo AddUser được nhập đúng đường dẫn

import './App.css'; // Giữ hoặc xóa tùy theo bạn có dùng CSS không
// URL API của backend
  const API_URL = 'http://localhost:3000/api/users';

  function App() {
    const [users, setUsers] = useState([]);

    // Hàm để lấy danh sách user từ backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
        console.error("Error adding user:", error);
      }
    };

    return (
      <div className="App">
        <h1>User Management</h1>
        <AddUser onAddUser={handleAddUser} />
        <UserList users={users} />
      </div>
    );
  }

  export default App;