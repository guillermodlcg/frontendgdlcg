import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest } from "../api/auth";
import Cookies from 'js-cookie';
import { safeStorage } from '../utils/safeStorage';
import { setAxiosToken } from '../api/axiosInstance';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe estar definido en un contexto");
    return context;
};

const ROLE_ADMIN = import.meta.env.VITE_ROLE_ADMIN;

const getStoredUser = () => {
    try {
        const u = safeStorage.getItem('gdlcg_user');
        return u ? JSON.parse(u) : null;
    } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    const tokenRef = useRef(safeStorage.getItem('gdlcg_token'));

    const [user, setUser] = useState(() => getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const stored = safeStorage.getItem('gdlcg_token');
        // FIX A: set axios header immediately on app load/refresh
        if (stored) setAxiosToken(stored);
        return !!stored;
    });
    const [isAdmin, setIsAdmin] = useState(() => {
        const u = getStoredUser();
        return u?.role === ROLE_ADMIN;
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateToken = (token) => {
        tokenRef.current = token;
        // FIX B: always sync axios header when token changes
        setAxiosToken(token);
        if (token) safeStorage.setItem('gdlcg_token', token);
        else safeStorage.removeItem('gdlcg_token');
    };

    const clearAll = () => {
        updateToken(null);
        safeStorage.removeItem('gdlcg_user');
        Cookies.remove('token');
    };

    const signUp = async (userData) => {
        try {
            const res = await registerRequest(userData);
            await new Promise(r => setTimeout(r, 150));
            const cookieToken = Cookies.get('token');
            if (cookieToken) updateToken(cookieToken);
            safeStorage.setItem('gdlcg_user', JSON.stringify(res.data));
            setUser(res.data);
            setIsAuthenticated(true);
            setIsAdmin(false);
        } catch (error) {
            setErrors(error.response?.data?.message || ['Error al registrar']);
        }
    };

    const signIn = async (userData) => {
        try {
            const res = await loginRequest(userData);
            await new Promise(r => setTimeout(r, 150));
            const cookieToken = Cookies.get('token');
            console.log('[AUTH] Token received:', !!cookieToken);
            if (cookieToken) updateToken(cookieToken);
            console.log('[AUTH] setAxiosToken called');
            console.log('[AUTH] safeStorage readback:', !!safeStorage.getItem('gdlcg_token'));
            safeStorage.setItem('gdlcg_user', JSON.stringify(res.data));
            if (res.data.role === ROLE_ADMIN) setIsAdmin(true);
            setUser(res.data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            setErrors(error.response?.data?.message || ['Error al iniciar sesión']);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const cookieToken = Cookies.get('token');
            const localToken = safeStorage.getItem('gdlcg_token');
            const token = cookieToken || localToken;

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                clearAll();
                return;
            }

            // Sincronizar ref con el token encontrado
            tokenRef.current = token;
            setAxiosToken(token);

            const storedUser = getStoredUser();
            if (storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);
                if (storedUser.role === ROLE_ADMIN) setIsAdmin(true);
            }

            try {
                const res = await verifyTokenRequest(token);
                if (!res.data) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsAdmin(false);
                    clearAll();
                } else {
                    setIsAuthenticated(true);
                    setUser(res.data);
                    safeStorage.setItem('gdlcg_user', JSON.stringify(res.data));
                    if (res.data.role === ROLE_ADMIN) setIsAdmin(true);
                    else setIsAdmin(false);
                }
            } catch {
                if (!storedUser) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsAdmin(false);
                    clearAll();
                }
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    const logOut = () => {
        logoutRequest();
        clearAll();
        // FIX C: clear axios header on logout
        setAxiosToken(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            signUp, signIn, user, setUser,
            isAuthenticated, errors, loading, isAdmin, logOut,
            tokenRef
        }}>
            {children}
        </AuthContext.Provider>
    );
};
