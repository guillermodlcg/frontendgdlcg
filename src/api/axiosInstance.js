import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL+'/api',
    withCredentials: true
});

// Interceptor: adjunta el token en cada request
instance.interceptors.request.use((config) => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default instance;