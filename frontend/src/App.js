import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import các trang (pages)
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Import instance axios đã cấu hình
import api from './api/axiosConfig';

// Import thư viện giải mã JWT
import { jwtDecode } from 'jwt-decode';

// Import file CSS
import './App.css';

// ====================================================================
// COMPONENT NAVIGATION: Quản lý thanh điều hướng
// ====================================================================
function Navigation() {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userRole: '',
    });

    // Hàm xử lý khi người dùng nhấn nút Đăng xuất
    const handleLogout = async () => {
        try {
            // Gọi API logout để server thu hồi Refresh Token
            await api.post('/users/logout');
        } catch (error) {
            // Lỗi có thể xảy ra nếu token đã hết hạn, nhưng không sao,
            // chúng ta vẫn sẽ dọn dẹp ở phía client.
            console.error("Lỗi khi gọi API logout (có thể bỏ qua):", error);
        } finally {
            // Luôn luôn thực hiện các bước này
            localStorage.removeItem('accessToken'); // Xóa Access Token
            setAuthState({ isLoggedIn: false, userRole: '' }); // Cập nhật trạng thái UI
            navigate('/login'); // Chuyển hướng về trang đăng nhập
            // Phát sự kiện để đảm bảo các component khác cũng cập nhật
            window.dispatchEvent(new Event('loginStateChange'));
        }
    };

    // useEffect để theo dõi và cập nhật trạng thái đăng nhập
    useEffect(() => {
        const updateAuthState = () => {
            // Đọc token từ localStorage với đúng key là 'accessToken'
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                try {
                    // Giải mã token để lấy thông tin (ví dụ: role)
                    const decodedToken = jwtDecode(token);
                    setAuthState({
                        isLoggedIn: true,
                        userRole: decodedToken.role,
                    });
                } catch (e) {
                    // Nếu token không hợp lệ (hỏng hoặc sai định dạng)
                    console.error("Token không hợp lệ:", e);
                    localStorage.removeItem('accessToken');
                    setAuthState({ isLoggedIn: false, userRole: '' });
                }
            } else {
                // Nếu không có token
                setAuthState({ isLoggedIn: false, userRole: '' });
            }
        };

        // Chạy lần đầu khi component được render
        updateAuthState();

        // Lắng nghe sự kiện storage (nếu đăng nhập/đăng xuất ở tab khác)
        window.addEventListener('storage', updateAuthState);
        // Lắng nghe sự kiện tùy chỉnh (được phát ra từ trang Login)
        window.addEventListener('loginStateChange', updateAuthState);

        // Dọn dẹp listener khi component bị unmount
        return () => {
            window.removeEventListener('storage', updateAuthState);
            window.removeEventListener('loginStateChange', updateAuthState);
        };
    }, []);

    return (
        <nav>
            <ul>
                {authState.isLoggedIn ? (
                    // === Menu khi đã đăng nhập ===
                    <>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>
                        
                        {/* Chỉ hiển thị link này nếu người dùng là Admin */}
                        {authState.userRole === 'admin' && (
                            <li><Link to="/admin/users">Quản lý User</Link></li>
                        )}
                        
                        <li>
                            <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
                        </li>
                    </>
                ) : (
                    // === Menu khi chưa đăng nhập ===
                    <>
                        <li><Link to="/signup">Đăng Ký</Link></li>
                        <li><Link to="/login">Đăng Nhập</Link></li>
                        <li><Link to="/forgotpassword">Quên mật khẩu?</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}


// ====================================================================
// COMPONENT APP CHÍNH: Quản lý toàn bộ ứng dụng
// ====================================================================
function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Hệ thống Quản lý Người dùng</h1>
                    <Navigation />
                </header>
                <hr />
                <main className="App-main">
                    <Routes>
                        {/* --- Định nghĩa các Route cho ứng dụng --- */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin/users" element={<AdminUserList />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
                        
                        {/* Route mặc định (trang chủ) */}
                        <Route path="/" element={
                            <div>
                                <h2>Chào mừng đến với dự án của Nhóm 8!</h2>
                                <p>Đây là trang chủ. Hãy đăng nhập hoặc đăng ký để bắt đầu.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;