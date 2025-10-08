// src/components/EditUser.jsx
import React, { useState, useEffect } from 'react';

const EditUser = ({ user, onUpdateUser, onCancelEdit }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  // Cập nhật state nếu prop 'user' thay đổi (khi chọn người dùng khác để sửa)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- BẮT ĐẦU PHẦN VALIDATION MỚI (Tương tự AddUser) ---
    // 1. Kiểm tra tên không được để trống (sau khi loại bỏ khoảng trắng ở đầu/cuối)
    if (!name.trim()) {
      alert("Tên không được để trống!");
      return; // Ngừng hàm nếu tên không hợp lệ
    }

    // 2. Kiểm tra định dạng email bằng Regular Expression
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ! Vui lòng nhập đúng định dạng.");
      return; // Ngừng hàm nếu email không hợp lệ
    }
    // --- KẾT THÚC PHẦN VALIDATION MỚI ---

    // Nếu tất cả validation đều qua, gọi hàm onUpdateUser từ component cha
    // Gửi đối tượng người dùng đã cập nhật, bao gồm ID
    onUpdateUser({ ...user, name, email });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>Sửa người dùng</h2>
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
      <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cập nhật người dùng</button>
      <button type="button" onClick={onCancelEdit} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' }}>Hủy</button>
    </form>
  );
};

export default EditUser;