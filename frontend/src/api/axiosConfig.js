import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    withCredentials: true, // Rất quan trọng: cho phép gửi cookie
});

// Interceptor để tự động thêm Access Token vào header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));                                                                                  

// Interceptor để xử lý khi Access Token hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Nếu lỗi là 401 và chưa thử lại
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Gọi API refresh-token
                const { data } = await api.post('/users/refresh-token');
                // Lưu access token mới
                localStorage.setItem('accessToken', data.accessToken);
                // Cập nhật lại header của request gốc và thử lại
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu refresh thất bại, logout người dùng
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;