import React, { createContext, useContext, useState, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest } from "../api/auth";
import Cookies from 'js-cookie';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe estar definido en un contexto");
    return context;
};

const ROLE_ADMIN = import.meta.env.VITE_ROLE_ADMIN;

// Helpers localStorage
const saveToken = (token) => {
    localStorage.setItem('gdlcg_token', token);
};
const saveUser = (user) => {
    localStorage.setItem('gdlcg_user', JSON.stringify(user));
};
const clearStorage = () => {
    localStorage.removeItem('gdlcg_token');
    localStorage.removeItem('gdlcg_user');
};
const getStoredToken = () => localStorage.getItem('gdlcg_token');
const getStoredUser = () => {
    try {
        const u = localStorage.getItem('gdlcg_user');
        return u ? JSON.parse(u) : null;
    } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    // Inicializar desde localStorage para sobrevivir refresh en móvil
    const [user, setUser] = useState(() => getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredToken());
    const [isAdmin, setIsAdmin] = useState(() => {
        const u = getStoredUser();
        return u?.role === ROLE_ADMIN;
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signUp = async (userData) => {
        try {
            const res = await registerRequest(userData);
            const token = Cookies.get('token') || getStoredToken();
            if (token) saveToken(token);
            saveUser(res.data);
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
            // Esperar un tick para que la cookie se establezca
            await new Promise(r => setTimeout(r, 100));
            const token = Cookies.get('token');
            if (token) saveToken(token);
            saveUser(res.data);
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

    // checkLogin: verifica cookie O localStorage
    useEffect(() => {
        async function checkLogin() {
            const cookieToken = Cookies.get('token');
            const localToken = getStoredToken();
            const token = cookieToken || localToken;

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                clearStorage();
                return;
            }

            // Si tenemos usuario en localStorage, usarlo inmediatamente
            // para no bloquear la UI mientras verificamos
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
                    clearStorage();
                } else {
                    setIsAuthenticated(true);
                    setUser(res.data);
                    saveUser(res.data);
                    if (res.data.role === ROLE_ADMIN) setIsAdmin(true);
                    else setIsAdmin(false);
                }
            } catch (error) {
                // Si falla la verificación pero tenemos datos locales, mantener sesión
                if (!storedUser) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsAdmin(false);
                    clearStorage();
                }
            } finally {
                setLoading(false);
            }
        }

        checkLogin();
    }, []);

    const logOut = () => {
        logoutRequest();
        Cookies.remove('token');
        clearStorage();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            signUp, signIn, user, setUser,
            isAuthenticated, errors, loading, isAdmin, logOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};
