import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList';
import { jwtDecode } from 'jwt-decode';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

// Component Navigation (Code này đã đúng, không cần sửa)
function Navigation() {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userRole: '',
    });

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setAuthState({ isLoggedIn: false, userRole: '' });
        navigate('/login');
    };

    useEffect(() => {
        const updateAuthState = () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setAuthState({
                        isLoggedIn: true,
                        userRole: decodedToken.role,
                    });
                } catch (e) {
                    console.error("Token không hợp lệ:", e);
                    localStorage.removeItem('userToken');
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
                    <>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>
                        {authState.userRole === 'admin' && (
                            <li><Link to="/admin/users">Quản lý User</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/signup">Đăng Ký</Link></li>
                        <li><Link to="/login">Đăng Nhập</Link></li>
                        <li><Link to="/forgotpassword">Quên mật khẩu?</Link></li> {/* << Thêm link Quên mật khẩu */}
                    </>
                )}
            </ul>
        </nav>
    );
}

// << CHỈ CÓ MỘT KHAI BÁO `App` DUY NHẤT >>
function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <hr />
                <main>
                    <Routes>
                        {/* --- Tất cả các Route được đặt ở đây --- */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin/users" element={<AdminUserList />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
                        
                        {/* Route mặc định (trang chủ) */}
                        <Route path="/" element={<h2>Chào mừng đến với trang chủ!</h2>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;