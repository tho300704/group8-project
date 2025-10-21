// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css'; // Hoặc file CSS của bạn

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/signup">Đăng Ký</Link></li>
                        <li><Link to="/login">Đăng Nhập</Link></li>
                    </ul>
                </nav>

                <hr />

                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    {/* Route mặc định */}
                    <Route path="/" element={<h2>Chào mừng đến với trang chủ!</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;