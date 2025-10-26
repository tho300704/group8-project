# **Dự án Ứng dụng Web Quản lý Người dùng - MERN Stack**

Đây là dự án thực hành xây dựng một ứng dụng web Full-stack hoàn chỉnh sử dụng MERN Stack (MongoDB, Express.js, React.js, Node.js). Ứng dụng bao gồm các chức năng cốt lõi về xác thực và quản lý người dùng, phân quyền, và các tính năng nâng cao.

## **Mục lục**

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Các tính năng chính](#các-tính-năng-chính)
- [Hướng dẫn cài đặt và chạy dự án](#hướng-dẫn-cài-đặt-và-chạy-dự-án)
  - [Yêu cầu](#yêu-cầu)
  - [Cài đặt Backend (Server)](#cài-đặt-backend-server)
  - [Cài đặt Frontend (Client)](#cài-đặt-frontend-client)
- [Thành viên nhóm](#thành-viên-nhóm)

## **Công nghệ sử dụng**

### **Backend**

- **Node.js**: Môi trường chạy JavaScript phía server.
- **Express.js**: Framework xây dựng API.
- **MongoDB**: Hệ quản trị cơ sở dữ liệu NoSQL.
- **Mongoose**: Thư viện ODM để làm việc với MongoDB.
- **JSON Web Token (JWT)**: Dùng cho xác thực và phân quyền.
- **Bcrypt.js**: Thư viện mã hóa mật khẩu.
- **Nodemailer**: Dùng để gửi email (tính năng Quên mật khẩu).
- **Cloudinary**: Dịch vụ lưu trữ và quản lý hình ảnh (tính năng Upload Avatar).
- **Dotenv**: Quản lý biến môi trường.

### **Frontend**

- **React.js**: Thư viện xây dựng giao diện người dùng.
- **React Router DOM**: Quản lý điều hướng trang.
- **Axios**: HTTP client để gọi API.
- **JWT Decode**: Giải mã JWT token phía client để lấy thông tin.

### **Công cụ phát triển**

- **Git & GitHub**: Quản lý phiên bản và mã nguồn.
- **VS Code**: Trình soạn thảo code.
- **Thunder Client / Postman**: Công cụ test API.
- **Nodemon**: Tự động khởi động lại server khi có thay đổi.

## **Các tính năng chính**

-   ✅ **Xác thực người dùng:**
    -   Đăng ký tài khoản mới (mã hóa mật khẩu).
    -   Đăng nhập (sử dụng JWT).
    -   Đăng xuất.
-   👤 **Quản lý thông tin cá nhân:**
    -   Xem thông tin cá nhân.
    -   Cập nhật thông tin (tên, email, mật khẩu).
-   🔐 **Phân quyền (RBAC - Role-Based Access Control):**
    -   Phân biệt vai trò `user` thường và `admin`.
    -   Các API và giao diện được bảo vệ, chỉ `admin` mới có thể truy cập.
-   👑 **Chức năng của Admin:**
    -   Xem danh sách tất cả người dùng trong hệ thống.
    -   Xóa tài khoản người dùng.
-   ✨ **Tính năng nâng cao:**
    -   **Quên mật khẩu:** Gửi email chứa link để người dùng đặt lại mật khẩu.
    -   **Upload Avatar:** Cho phép người dùng tải lên và cập nhật ảnh đại diện (lưu trữ trên Cloudinary).

## **Hướng dẫn cài đặt và chạy dự án**

### **Yêu cầu**

-   [Node.js](https://nodejs.org/) (phiên bản LTS)
-   [Git](https://git-scm.com/)
-   Một tài khoản MongoDB Atlas (miễn phí).
-   Một tài khoản Cloudinary (miễn phí).
-   Một tài khoản Gmail với "Mật khẩu ứng dụng".

### **1. Clone Repository**

```bash
git clone <URL_CUA_REPOSITORY>
cd <TEN_THU_MUC_DU_AN>
```

### **2. Cài đặt Backend (Server)**

1.  **Di chuyển vào thư mục backend:**
    ```bash
    cd backend
    ```

2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```

3.  **Tạo file `.env`:**
    Tạo một file mới tên là `.env` trong thư mục `/backend` và thêm vào các biến môi trường sau:

    ```env
    PORT=3000
    MONGO_URI=<CHUOI_KET_NOI_MONGODB_ATLAS_CUA_BAN>
    JWT_SECRET=<MOT_CHUOI_BI_MAT_NGAY_NHIEN_RAT_DAI>

    # Cấu hình Nodemailer (Gmail)
    EMAIL_USER=<EMAIL_GMAIL_CUA_BAN>
    EMAIL_PASS=<MAT_KHAU_UNG_DUNG_GMAIL_CUA_BAN>
    FROM_EMAIL=<EMAIL_GMAIL_CUA_BAN>
    FROM_NAME="Ten Ung Dung"

    # Cấu hình Cloudinary
    CLOUDINARY_CLOUD_NAME=<CLOUD_NAME_CUA_BAN>
    CLOUDINARY_API_KEY=<API_KEY_CUA_BAN>
    CLOUDINARY_API_SECRET=<API_SECRET_CUA_BAN>
    ```

4.  **Chạy server backend:**
    ```bash
    npm run dev
    ```
    Server sẽ chạy tại `http://localhost:3000`.

### **3. Cài đặt Frontend (Client)**

1.  **Mở một terminal mới** và di chuyển vào thư mục `frontend`:
    ```bash
    cd frontend
    ```

2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```

3.  **Chạy ứng dụng React:**
    ```bash
    npm start
    ```
    Ứng dụng sẽ tự động mở trong trình duyệt tại `http://localhost:3001`.

## **Thành viên nhóm**
| 1   | **Nguyễn Phước Thọ**  | `xxxxxx` | **Nhóm trưởng**, Database, Git 
| 2   | **Lê Đức Thịnh**      | `xxxxxx` | Backend (Node.js, Express.js)                |
| 3   | **Trần Quang Định**   | `xxxxxx` | Frontend (React.js)                            |