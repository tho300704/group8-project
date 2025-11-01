import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import các trang (pages)
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// <<< BƯỚC 1: IMPORT COMPONENT MỚI >>>
import AdminLogViewer from './pages/AdminLogViewer';

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
            await api.post('/users/logout');
        } catch (error) {
            console.error("Lỗi khi gọi API logout (có thể bỏ qua):", error);
        } finally {
            localStorage.removeItem('accessToken');
            setAuthState({ isLoggedIn: false, userRole: '' });
            navigate('/login');
            window.dispatchEvent(new Event('loginStateChange'));
        }
    };

    // useEffect để theo dõi và cập nhật trạng thái đăng nhập
    useEffect(() => {
        const updateAuthState = () => {
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setAuthState({
                        isLoggedIn: true,
                        userRole: decodedToken.role,
                    });
                } catch (e) {
                    console.error("Token không hợp lệ:", e);
                    localStorage.removeItem('accessToken');
                    setAuthState({ isLoggedIn: false, userRole: '' });
                }
            } else {
                setAuthState({ isLoggedIn: false, userRole: '' });
            }
        };

        updateAuthState();
        window.addEventListener('storage', updateAuthState);
        window.addEventListener('loginStateChange', updateAuthState);

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
                        
                        {/* Hiển thị link Quản lý User cho admin và moderator */}
                        {(authState.userRole === 'admin' || authState.userRole === 'moderator') && (
                            <li><Link to="/admin/users">Quản lý User</Link></li>
                        )}
                        
                        {/* <<< BƯỚC 2: THÊM LINK XEM LOGS CHỈ DÀNH CHO ADMIN >>> */}
                        {authState.userRole === 'admin' && (
                             <li><Link to="/admin/logs">Xem Logs</Link></li>
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
                    <h1>Hệ thống Quản lý Người dùng Nâng cao</h1>
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
                        <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
                        
                        {/* <<< BƯỚC 3: THÊM ROUTE MỚI CHO TRANG XEM LOGS >>> */}
                        <Route path="/admin/logs" element={<AdminLogViewer />} />
                        
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