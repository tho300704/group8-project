# Dự án Quản lý người dùng - Group 8

Dự án demo full-stack xây dựng một ứng dụng web đơn giản cho phép quản lý danh sách người dùng (CRUD).

## Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MongoDB Atlas (sử dụng Mongoose)
- **Quản lý phiên bản:** Git & GitHub

## Tính năng chính

- Hiển thị danh sách người dùng.
- Thêm người dùng mới.
- Xóa người dùng.
- (Tùy chọn) Sửa thông tin người dùng.

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (v16 trở lên)
- npm hoặc yarn
- Git

### Các bước cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/group8-project.git
   cd group8-project
   ```

2. **Cài đặt Backend:**
   ```bash
   cd backend
   npm install
   ```
   Tạo file `.env` và cấu hình biến `MONGO_URI`.

3. **Cài đặt Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Chạy dự án

1. **Chạy server Backend:** (Mở 1 terminal)
   ```bash
   cd backend
   npm run dev
   ```
   Server sẽ chạy tại `http://localhost:3000`.

2. **Chạy ứng dụng Frontend:** (Mở 1 terminal khác)
   ```bash
   cd frontend
   npm start
   ```
   Ứng dụng sẽ mở tại `http://localhost:3001`.

## Đóng góp của thành viên

| STT | Họ và tên             | MSSV     | Vai trò chính |
|-----|-----------------------|----------|----------------|
| 1   | Nguyễn Phước Thọ      | xxxxxxxx | Team Leader, Database (MongoDB) |
| 2   | Lê Đức Thịnh          | xxxxxxxx | Backend (Node.js, Express) |
| 3   | Trần Quang Định        | xxxxxxxx | Frontend (React.js) |
