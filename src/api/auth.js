import axios from "./axiosInstance";

//Request para registrar usuarios
export const registerRequest = user =>axios.post('/register', user);

//Request para iniciar sesión
export const loginRequest = user => axios.post('/login', user);

//Request para validar el Token de inicio de sesión
export const verifyTokenRequest = () => axios.get('/verify');

//Request para cerrar sesión
export const logoutRequest = () => axios.post('/logout');

//Request para actualizar perfil
export const updateProfileRequest = (data) => axios.put('/profile', data);

//Request para obtener estadísticas del usuario
export const getUserStatsRequest = () => axios.get('/profile/stats');

//Request para agregar favorito
export const addFavoriteRequest = (productId) => axios.post('/favorites', { productId });

//Request para quitar favorito
export const removeFavoriteRequest = (productId) => axios.delete(`/favorites/${productId}`);

//Request para obtener favoritos
export const getFavoritesRequest = () => axios.get('/favorites');

//Request para cambiar contraseña
export const changePasswordRequest = (data) => axios.put('/change-password', data);

//Request para eliminar cuenta
export const deleteAccountRequest = (password) => axios.delete('/delete-account', { data: { password } });

//Request para obtener todos los usuarios (admin)
export const getAllUsersRequest = () => axios.get('/admin/users');

//Request para eliminar un usuario (admin)
export const deleteUserRequest = (id) => axios.delete(`/admin/users/${id}`);