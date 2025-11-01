import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsLoggedIn } from '../features/auth/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(state => state.auth.user);
    const location = useLocation();

    if (!isLoggedIn) {
        // Nếu chưa đăng nhập, chuyển về trang login
        // Lưu lại trang muốn truy cập để sau khi login có thể quay lại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Nếu có yêu cầu vai trò cụ thể và vai trò user không khớp
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Chuyển đến trang "Không có quyền" (hoặc về trang chủ)
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu đã đăng nhập và có quyền, cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;