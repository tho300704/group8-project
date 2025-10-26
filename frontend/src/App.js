import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList'; // << 1. Import trang Admin
import { jwtDecode } from 'jwt-decode'; // << 2. Import jwt-decode đúng cách
import './App.css';

// Component Navigation riêng để quản lý các link điều hướng
function Navigation() {
    const navigate = useNavigate();
    // Gộp 2 state lại để quản lý trạng thái đăng nhập và vai trò
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userRole: '',
    });

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Xóa token
        // Cập nhật lại state để UI thay đổi
        setAuthState({ isLoggedIn: false, userRole: '' });
        navigate('/login'); // Chuyển về trang đăng nhập
    };

    // Theo dõi sự thay đổi của trạng thái đăng nhập
    useEffect(() => {
        const updateAuthState = () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token); // Giải mã token
                    setAuthState({
                        isLoggedIn: true,
                        userRole: decodedToken.role, // Lấy role từ payload của token
                    });
                } catch (e) {
                    // Xử lý trường hợp token bị hỏng hoặc không hợp lệ
                    console.error("Token không hợp lệ:", e);
                    localStorage.removeItem('userToken');
                    setAuthState({ isLoggedIn: false, userRole: '' });
                }
            } else {
                setAuthState({ isLoggedIn: false, userRole: '' });
            }
        };

        // Chạy lần đầu khi component render
        updateAuthState();

        // Lắng nghe các sự kiện để cập nhật lại trạng thái
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
                    // Menu khi đã đăng nhập
                    <>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>

                        {/* << 3. Hiển thị link Admin nếu có quyền */}
                        {authState.userRole === 'admin' && (
                            <li><Link to="/admin/users">Quản lý User</Link></li>
                        )}

                        <li>
                            <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
                        </li>
                    </>
                ) : (
                    // Menu khi chưa đăng nhập
                    <>
                        <li><Link to="/signup">Đăng Ký</Link></li>
                        <li><Link to="/login">Đăng Nhập</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}


function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <hr />
                <main>
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin/users" element={<AdminUserList />} /> {/* << 4. Thêm Route cho trang Admin */}
                        <Route path="/" element={<h2>Chào mừng đến với trang chủ!</h2>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;