import React, { useState, useEffect } from 'react';

const UserForm = ({ userToEdit, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Khi userToEdit thay đổi (tức là có người dùng được chọn để sửa),
  // cập nhật state của form với dữ liệu của người dùng đó.
  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
    } else {
      // Reset form khi không có người dùng nào đang được chỉnh sửa
      setName('');
      setEmail('');
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Tên và Email không được để trống!');
      return;
    }

    const userData = { name, email };
    if (userToEdit) {
      // Nếu đang chỉnh sửa, thêm id vào dữ liệu
      onSubmit({ ...userData, id: userToEdit.id });
    } else {
      // Nếu là thêm mới (chúng ta sẽ thêm chức năng này sau nếu cần)
      onSubmit(userData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h3>{userToEdit ? 'Sửa Người dùng' : 'Thêm Người dùng Mới'}</h3>
      <div>
        <label>Tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: '15px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {userToEdit ? 'Cập nhật' : 'Thêm'}
      </button>
      {userToEdit && (
        <button
          type="button"
          onClick={() => onSubmit(null)} // Huỷ chỉnh sửa, đóng form
          style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Hủy
        </button>
      )}
    </form>
  );
};

export default UserForm;