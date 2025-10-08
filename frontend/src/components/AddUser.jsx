// src/components/AddUser.jsx
import React, { useState } from 'react';

const AddUser = ({ onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- BẮT ĐẦU PHẦN VALIDATION MỚI ---
    // 1. Kiểm tra tên không được để trống (sau khi loại bỏ khoảng trắng ở đầu/cuối)
    if (!name.trim()) {
      alert("Tên không được để trống!");
      return; // Ngừng hàm nếu tên không hợp lệ
    }

    // 2. Kiểm tra định dạng email bằng Regular Expression
    // Regex này kiểm tra chuỗi có dạng "ky_tu@ky_tu.ky_tu"
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ! Vui lòng nhập đúng định dạng.");
      return; // Ngừng hàm nếu email không hợp lệ
    }
    // --- KẾT THÚC PHẦN VALIDATION MỚI ---

    // Nếu tất cả validation đều qua, gọi hàm onAddUser từ component cha
    onAddUser({ name, email });
    
    // Reset các trường input sau khi thêm thành công
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>Thêm người dùng mới</h2>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Thêm người dùng</button>
    </form>
  );
};

export default AddUser;