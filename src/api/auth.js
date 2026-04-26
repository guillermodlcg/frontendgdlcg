import axios from "./axiosInstance";
import { safeStorage } from '../utils/safeStorage';

// Explicit token header for iOS Safari — same pattern as orders.js
const authHeader = () => {
    const token =
        axios.defaults.headers.common['Authorization']?.replace('Bearer ', '') ||
        safeStorage.getItem('gdlcg_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

//Request para registrar usuarios
export const registerRequest = user => axios.post('/register', user);

//Request para iniciar sesión
export const loginRequest = user => axios.post('/login', user);

//Request para validar el Token de inicio de sesión
export const verifyTokenRequest = () => axios.get('/verify', { headers: authHeader() });

//Request para cerrar sesión
export const logoutRequest = () => axios.post('/logout');

//Request para actualizar perfil
export const updateProfileRequest = (data) => axios.put('/profile', data, { headers: authHeader() });

//Request para obtener estadísticas del usuario
export const getUserStatsRequest = () => axios.get('/profile/stats', { headers: authHeader() });

//Request para agregar favorito
export const addFavoriteRequest = (productId) => axios.post('/favorites', { productId }, { headers: authHeader() });

//Request para quitar favorito
export const removeFavoriteRequest = (productId) => axios.delete(`/favorites/${productId}`, { headers: authHeader() });

//Request para obtener favoritos
export const getFavoritesRequest = () => axios.get('/favorites', { headers: authHeader() });

//Request para cambiar contraseña
export const changePasswordRequest = (data) => axios.put('/change-password', data, { headers: authHeader() });

//Request para eliminar cuenta
export const deleteAccountRequest = (password) => axios.delete('/delete-account', { data: { password }, headers: authHeader() });

//Request para obtener todos los usuarios (admin)
export const getAllUsersRequest = () => axios.get('/admin/users', { headers: authHeader() });

//Request para eliminar un usuario (admin)
export const deleteUserRequest = (id) => axios.delete(`/admin/users/${id}`, { headers: authHeader() });