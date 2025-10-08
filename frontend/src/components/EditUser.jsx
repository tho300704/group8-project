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
    if (!name || !email) {
      alert('Vui lòng nhập tên và email');
      return;
    }
    // Gửi đối tượng người dùng đã cập nhật, bao gồm ID
    onUpdateUser({ ...user, name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sửa người dùng</h2>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Cập nhật người dùng</button>
      <button type="button" onClick={onCancelEdit} style={{ marginLeft: '5px' }}>Hủy</button>
    </form>
  );
};

export default EditUser;