// src/components/UserList.jsx
import React from 'react';

// Component này giờ đây nhận thêm hai props: onEdit và onDelete
const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? ( // Hiển thị thông báo nếu danh sách rỗng
        <p>Không tìm thấy người dùng nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id || user.id}>
              {user.name} - {user.email}
              {/* Nút "Sửa": Khi click, gọi hàm onEdit và truyền đối tượng user hiện tại */}
              <button onClick={() => onEdit(user)} style={{ marginLeft: '10px' }}>Sửa</button>
              {/* Nút "Xóa": Khi click, gọi hàm onDelete và truyền ID của user hiện tại */}
              <button onClick={() => onDelete(user._id || user.id)} style={{ marginLeft: '5px' }}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;