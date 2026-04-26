import axios from 'axios';
import Cookies from 'js-cookie';
import { safeStorage } from '../utils/safeStorage';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + '/api',
    withCredentials: true
});

// Sets the token directly on the instance default headers.
// Call this immediately after login/logout so every subsequent
// request carries the header without relying on storage reads.
export const setAxiosToken = (token) => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
};

// Interceptor as fallback — reads fresh token on every request (iOS Safari safe)
instance.interceptors.request.use((config) => {
    if (!config.headers['Authorization']) {
        const token = Cookies.get('token') || safeStorage.getItem('gdlcg_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export default instance;
