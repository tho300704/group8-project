import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
//import { useNavigate } from 'react-router-dom';

const AdminLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    //const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/users/logs');
                setLogs(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div>Đang tải logs...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2>Nhật Ký Hoạt Động Người Dùng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                        <th>Người dùng</th>
                        <th>IP</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id}>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                            <td>{log.action}</td>
                            <td>{log.user ? `${log.user.name} (${log.user.email})` : 'N/A'}</td>
                            <td>{log.ipAddress}</td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminLogViewer;