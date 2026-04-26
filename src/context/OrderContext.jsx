import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    createOrderRequest,
    updateStatusOrderRequest,
    getOrdersRequest,
    getUserOrderRequest,
    getOrderByIDRequest,
    deleteOrderRequest
} from '../api/orders';
import { toast } from 'react-toastify';


const OrderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => {
    const context = useContext(OrderContext);

    if (!context)
        throw new Error("Orders debe estar en un contexto")

    return context;
};
//;;//Fin de useOrders

export function OrdersProvider ({ children }){
    const { isAdmin } = useAuth();
    const [orders, setOrders] = useState( [ ] );
    const [errors, setErrors] = useState( [ ] );

//Función para obtener todas las ordenes de la base de datos
const getOrders = async () => {
    console.log("getOrders llamado, isAdmin:", isAdmin);
    try {
        let res;
        if (isAdmin === true) {
            console.log("Obteniendo todas las órdenes (admin)");
            res = await getOrdersRequest();
        } else {
            console.log("Obteniendo órdenes del usuario");
            res = await getUserOrderRequest();
        }
        console.log("Órdenes recibidas:", res?.data?.length || 0, "órdenes");
        setOrders(res?.data || []);
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        setOrders([]);
        // No mostrar toast si es un 404 (no hay órdenes aún)
        if (error.response?.status !== 404) {
            toast.error("Error al obtener las ordenes");
        }
        setErrors(error.response?.data?.message || "Error desconocido");
    }
}; //Fin de getOrders
//Función para crear una orden

const createOrder = async (order) => {
    try {
        await createOrderRequest(order);
        toast.success("Orden creada con éxito");
        // Refrescar lista silenciosamente sin bloquear ni mostrar error
        try { await getOrders(); } catch (_) {}
    } catch (error) {
        const msg = error.response?.data?.message?.[0] || error.response?.data?.message || "Error al crear la orden";
        toast.error(msg);
        setErrors(msg);
        throw error; // re-lanzar para que SalesPage pueda manejarlo
    }
}; //Fin de createOrder

//Función para actualizar el status de una orden
const updateStatusOrder = async (id, status) => {
    try {
        console.log("Actualizando orden:", id, status);
        await updateStatusOrderRequest(id, status);
        console.log("Orden actualizada, recargando lista...");
        await getOrders();
        toast.success("Estado de la orden actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        toast.error("Error al actualizar el estado");
        setErrors(error.response?.data?.message || "Error desconocido");
    }
}; //Fin de updateStatusOrder
//Función para obtener una orden por Id
const getOrderById = async (id) => {
    try {
        const res = await getOrderByIDRequest(id);
        return res.data;
    } catch (error) {
        toast.error("Error al obtener la orden por id");
        setErrors(error.response.data.message);
    }
}; //Fin de getOrderById

//Función para eliminar una orden
const deleteOrder = async (id) => {
    try {
        console.log("Eliminando orden:", id);
        const response = await deleteOrderRequest(id);
        console.log("Respuesta del servidor:", response.data);
        console.log("Orden eliminada, recargando lista...");
        await getOrders();
        console.log("Lista recargada exitosamente");
        toast.success("Orden eliminada con éxito");
    } catch (error) {
        console.error("Error al eliminar orden:", error);
        toast.error("Error al eliminar la orden");
        setErrors(error.response?.data?.message || "Error desconocido");
    }
}; //Fin de deleteOrder

//Use effect que vacía el arreglo de errores pasados 5 segundos
useEffect(() => {
    if (errors && errors.length > 0) {
        const timer = setTimeout(() => {
            setErrors([]);
        }, 5000);
        return () => clearTimeout(timer);
    } //Fin de if
}, [errors]); //Fin de useEffect


    return (
        <OrderContext.Provider value = { {
            orders,
            errors,
            getOrders,
            createOrder,
            updateStatusOrder,
            getOrderById,
            deleteOrder
        } }>
            { children }
        </OrderContext.Provider>
    );
};
//Fin de OrdersProvider