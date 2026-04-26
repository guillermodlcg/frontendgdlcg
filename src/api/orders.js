import axios from './axiosInstance';
import { safeStorage } from '../utils/safeStorage';

// Builds an explicit Authorization header from all available token sources.
// This is required on iOS Safari where cookies are blocked cross-site and
// the axios interceptor may run before the module-level memoryCache is populated.
const authHeader = () => {
    const token =
        axios.defaults.headers.common['Authorization']?.replace('Bearer ', '') ||
        safeStorage.getItem('gdlcg_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

//Llamada para agregar un pedido
export const createOrderRequest = (order) =>
    axios.post('/order', order, { headers: authHeader() });

//Llamada para actualizar el estado de una orden
export const updateStatusOrderRequest = (id, status) =>
    axios.put('/order/status/' + id, status, { headers: authHeader() });

//Llamada para obtener todas las ordenes para el administrador
export const getOrdersRequest = () =>
    axios.get('/order/admin/all', { headers: authHeader() });

//Llamada al api para obtener todas las ordenes para un usuario
export const getUserOrderRequest = () =>
    axios.get('/order/my', { headers: authHeader() });

//Llamada al api para obtener una orden por id
export const getOrderByIDRequest = (id) =>
    axios.get('/order/' + id, { headers: authHeader() });

//Llamada al api para eliminar una orden
export const deleteOrderRequest = (id) =>
    axios.delete('/order/' + id, { headers: authHeader() });