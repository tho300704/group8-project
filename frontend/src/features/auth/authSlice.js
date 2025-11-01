import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Lấy accessToken từ localStorage để khởi tạo state
const accessToken = localStorage.getItem('accessToken');
let initialState = {
    user: null,
    accessToken: accessToken ? accessToken : null,
    isLoggedIn: accessToken ? true : false,
};

// Nếu có token, giải mã để lấy thông tin user
if (accessToken) {
    try {
        const decoded = jwtDecode(accessToken);
        initialState.user = {
            id: decoded.id,
            role: decoded.role,
        };
    } catch (e) {
        console.error("Token không hợp lệ khi khởi tạo:", e);
        localStorage.removeItem('accessToken');
        initialState = { user: null, accessToken: null, isLoggedIn: false };
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer để xử lý khi đăng nhập thành công
        loginSuccess: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.isLoggedIn = true;
            
            const decoded = jwtDecode(action.payload.accessToken);
            state.user = {
                id: decoded.id,
                role: decoded.role,
                // Bạn có thể thêm name, email từ payload nếu API login trả về
                name: action.payload.name,
                email: action.payload.email,
            };
        },
        // Reducer để xử lý khi đăng xuất
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLoggedIn = false;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

// Selectors để dễ dàng lấy state trong component
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;