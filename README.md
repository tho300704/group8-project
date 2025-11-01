# Ứng dụng Web MERN Stack: Quản lý Người dùng Nâng cao

Chào mừng đến với dự án cuối kỳ của **Nhóm 8**. Đây là một ứng dụng Full-stack hoàn chỉnh được xây dựng bằng MERN Stack (MongoDB, Express.js, React, Node.js), tập trung vào các tính năng xác thực và quản lý người dùng bảo mật, chuyên nghiệp.

## ✨ Tính năng chính

Ứng dụng cung cấp một hệ thống User Management toàn diện với các chức năng:

### 👨‍💻 Chức năng cho Người dùng
- **Xác thực:** Đăng ký, Đăng nhập, Đăng xuất.
- **Quản lý phiên đăng nhập:** Tự động duy trì đăng nhập bằng hệ thống **Access Token + Refresh Token**.
- **Quản lý tài khoản:** Xem và cập nhật thông tin cá nhân (tên, email, mật khẩu).
- **Upload Avatar:** Tải lên và xử lý ảnh đại diện, lưu trữ trên **Cloudinary**.
- **Bảo mật:** Chức năng **Quên mật khẩu** và **Đặt lại mật khẩu** thông qua email thật (Gmail SMTP).

### 👮‍♂️ Chức năng cho Quản trị viên
- **Phân quyền nâng cao (RBAC):** Hệ thống 3 vai trò: `User`, `Moderator`, và `Admin`.
- **Quản lý Người dùng:** Admin và Moderator có thể xem danh sách tất cả người dùng.
- **Xóa Người dùng:** Chỉ Admin có quyền xóa tài khoản người dùng khác.
- **Giám sát hệ thống:** Admin có thể xem **nhật ký hoạt động** chi tiết của toàn bộ người dùng.

### 🛡️ Tính năng Bảo mật
- **Mã hóa mật khẩu:** Mật khẩu được băm an toàn bằng `bcryptjs`.
- **Xác thực API:** Các API nhạy cảm được bảo vệ bằng `JSON Web Tokens (JWT)`.
- **Chống Brute Force:** API Đăng nhập được trang bị **Rate Limiting**, giới hạn số lần thử sai.
- **Bảo vệ Route:** Các trang phía Frontend được bảo vệ bằng `Protected Routes`, chỉ cho phép truy cập dựa trên trạng thái đăng nhập và vai trò.

### Frontend
- **Quản lý State chuyên nghiệp:** Sử dụng **Redux Toolkit** để quản lý trạng thái toàn cục của ứng dụng.
- **Giao diện động:** Tự động ẩn/hiện các chức năng dựa trên vai trò của người dùng.

## 🛠️ Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Frontend:** React, Redux Toolkit
- **Database:** MongoDB (sử dụng MongoDB Atlas)
- **Xác thực:** JSON Web Token (JWT), cookie-parser, bcryptjs
- **Upload ảnh:** Cloudinary, Multer, Sharp
- **Gửi Email:** Nodemailer (với Gmail SMTP)
- **Bảo mật:** express-rate-limit, cors
- **Môi trường:** dotenv

## 🚀 Hướng dẫn Cài đặt và Chạy dự án

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:

### 1. Yêu cầu
- [Node.js](https://nodejs.org/) (phiên bản 16 trở lên)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- Một tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Một tài khoản [Cloudinary](https://cloudinary.com/)
- Một tài khoản [Gmail](https://mail.google.com/) đã bật Xác minh 2 bước và có Mật khẩu ứng dụng.

### 2. Clone Repository
```bash
git clone <URL_repository_cua_ban>
cd <ten_thu_muc_du_an>
```

### 3. Cấu hình Backend

1.  **Di chuyển vào thư mục backend và cài đặt dependencies:**
    ```bash
    cd backend
    npm install
    ```

2.  **Tạo file `.env`:**
    Tạo một file tên là `.env` trong thư mục `backend` và sao chép nội dung từ file `.env.example` (nếu có) hoặc điền các biến sau:

    ```env
    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # MongoDB Connection
    MONGO_URI=<chuoi_ket_noi_mongodb_atlas_cua_ban>

    # JWT Secrets
    JWT_SECRET=<mot_chuoi_bi_mat_dai_bat_ky>

    # Frontend URL (cho CORS và link reset password)
    FRONTEND_URL=http://localhost:3001

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=<cloud_name_cua_ban>
    CLOUDINARY_API_KEY=<api_key_cua_ban>
    CLOUDINARY_API_SECRET=<api_secret_cua_ban>

    # Nodemailer (Gmail) Credentials
    EMAIL_USER=<dia_chi_gmail_cua_ban>
    EMAIL_PASS=<mat_khau_ung_dung_16_ky_tu_cua_ban>
    ```

3.  **Chạy Backend Server:**
    ```bash
    npm run dev
    ```
    Server sẽ chạy tại `http://localhost:3000`.

### 4. Cấu hình Frontend

1.  **Mở một terminal mới**, di chuyển vào thư mục `frontend` và cài đặt dependencies:
    ```bash
    cd frontend
    npm install
    ```

2.  **Tạo file `.env`:**
    Tạo một file tên là `.env` trong thư mục `frontend` và thêm biến sau:

    ```env
    REACT_APP_API_URL=http://localhost:3000
    ```
    *Lưu ý: `baseURL` trong code sẽ tự động thêm `/api` vào sau URL này.*

3.  **Chạy Frontend:**
    ```bash
    npm start
    ```
    Ứng dụng React sẽ mở tại `http://localhost:3001`.

Bây giờ bạn có thể truy cập ứng dụng và sử dụng tất cả các tính năng!

## 👥 Thành viên Nhóm 8

| STT | Tên thành viên      | MSSV      | Vai trò                                      |
|-----|---------------------|-----------|-----------------------------------------------|
| 1   | **Nguyễn Phước Thọ**  | 21...     | Trưởng nhóm, Database, Git Manager, Tester    |
| 2   | **Lê Đức Thịnh**      | 21...     | Lập trình viên Backend                        |
| 3   | **Trần Quang Định**   | 21...     | Lập trình viên Frontend                       |

---