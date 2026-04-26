import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + '/api',
    withCredentials: true
});

// Lee token fresco en cada request: cookie primero, localStorage como fallback
instance.interceptors.request.use((config) => {
    const token = Cookies.get('token') || localStorage.getItem('gdlcg_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default instance;
