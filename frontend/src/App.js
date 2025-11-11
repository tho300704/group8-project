// src/App.js

import React from 'react'; // Bỏ useEffect và useState vì Redux sẽ quản lý
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';

// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn, selectUser, logout } from './features/auth/authSlice';

// --- Page & Component Imports ---
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogViewer from './pages/AdminLogViewer';
import ProtectedRoute from './components/ProtectedRoute'; // <<< BƯỚC 1: IMPORT PROTECTED ROUTE
import api from './api/axiosConfig';
import './App.css';

// ====================================================================
// COMPONENT NAVIGATION: Quản lý thanh điều hướng (ĐÃ CẬP NHẬT VỚI REDUX)
// ====================================================================
function Navigation() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // <<< BƯỚC 2: LẤY STATE TRỰC TIẾP TỪ REDUX STORE >>>
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);

    // Hàm xử lý khi người dùng nhấn nút Đăng xuất
    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Lỗi khi gọi API logout (có thể bỏ qua):", error);
        } finally {
            // Xóa token ở client
            localStorage.removeItem('accessToken');
            // Gửi action 'logout' đến Redux store để reset state
            dispatch(logout());
            // Điều hướng về trang login
            navigate('/login');
        }
    };

    return (
        <nav>
            <ul>
                {isLoggedIn ? (
                    // === Menu khi đã đăng nhập ===
                    <>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>
                        
                        {(user?.role === 'admin' || user?.role === 'moderator') && (
                            <li><Link to="/admin/users">Quản lý User</Link></li>
                        )}
                        
                        {user?.role === 'admin' && (
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
                    </>
                )}
            </ul>
        </nav>
    );
}


// ====================================================================
// COMPONENT APP CHÍNH: Quản lý toàn bộ ứng dụng (ĐÃ CẬP NHẬT VỚI PROTECTED ROUTES)
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
                        {/* --- Public Routes: Ai cũng có thể truy cập --- */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
                        
                        {/* Trang chủ */}
                        <Route path="/" element={
                            <div>
                                <h2>Chào mừng đến với dự án của Nhóm 8!</h2>
                                <p>Đây là trang chủ. Hãy đăng nhập hoặc đăng ký để bắt đầu.</p>
                            </div>
                        } />

                        {/* --- Protected Routes: Chỉ người dùng đã đăng nhập --- */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* --- Admin & Moderator Protected Routes --- */}
                        <Route element={<ProtectedRoute allowedRoles={['admin', 'moderator']} />}>
                            <Route path="/admin/users" element={<AdminUserList />} />
                        </Route>

                        {/* --- Admin Only Protected Routes --- */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/logs" element={<AdminLogViewer />} />
                        </Route>
                        
                        {/* --- Fallback Routes --- */}
                        <Route path="/unauthorized" element={<h2>403 - Bạn không có quyền truy cập trang này</h2>} />
                        <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />

                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;