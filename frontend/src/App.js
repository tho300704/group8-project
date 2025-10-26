// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile'; // Import trang Profile
import './App.css';

// Component Navigation riêng để quản lý các link điều hướng
function Navigation() {
    const navigate = useNavigate();
    // Dùng state để UI tự cập nhật khi login/logout
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Xóa token
        setIsLoggedIn(false); // Cập nhật trạng thái
        navigate('/login'); // Chuyển về trang đăng nhập
    };

    // Theo dõi sự thay đổi của trạng thái đăng nhập
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('userToken'));
        };
        // Lắng nghe sự kiện storage để cập nhật nếu login/logout ở tab khác
        window.addEventListener('storage', handleStorageChange);
        // Cần một cách để component này "biết" khi login thành công
        // Dưới đây là một listener sự kiện tùy chỉnh đơn giản
        window.addEventListener('loginStateChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('loginStateChange', handleStorageChange);
        };
    }, []);


    return (
        <nav>
            <ul>
                {isLoggedIn ? (
                    // Menu khi đã đăng nhập
                    <>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>
                        <li><button onClick={handleLogout} className="logout-button">Đăng Xuất</button></li>
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
                        <Route path="/" element={<h2>Chào mừng đến với trang chủ!</h2>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;