import axios from './axiosInstance';
import { safeStorage } from '../utils/safeStorage';

// Explicit token header for iOS Safari
const authHeader = () => {
    const token =
        axios.defaults.headers.common['Authorization']?.replace('Bearer ', '') ||
        safeStorage.getItem('gdlcg_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

//Llamada a la api para obtener todos los productos
export const getProductsRequest = () => axios.get('/products', { headers: authHeader() });

//Llamada a la api para crear un producto
export const createProductRequest = (product) => axios.post('/products', product, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
});

//Llamada al api para obtener un producto por id
export const getProductRequest = (id) => axios.get('/products/' + id, { headers: authHeader() });

//Llamada al api para eliminar un producto por id
export const deleteProductRequest = (id) => axios.delete('/products/' + id, { headers: authHeader() });

//Llamada al api para editar un producto y cambiar la imagen
export const updateProductRequest = (id, product) =>
    axios.put('/products/updatewithimage/' + id, product, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
    });

//Llamada al api para editar un producto sin cambiar la imagen
export const updateProductRequestNoUpdateImage = (id, product) =>
    axios.put('/products/' + id, product, { headers: authHeader() });

//Llamada a la api para obtener todos los productos, sin importar el usuario
//para la parte pública en la compra de productos
export const getAllProductsRequest = () => axios.get('/getallproducts');