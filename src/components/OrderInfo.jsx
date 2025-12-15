import React from "react";
import OrderStatus from "./OrderStatus";
import SelectOrderStatus from "./SelectOrderStatus";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { toast } from "react-toastify";

function OrderInfo({ id, quantity, subtotal, iva, total, status, orderDate }) {
  const { isAdmin } = useAuth();
  const { updateStatusOrder } = useOrders();
  
  // Función para formatear la fecha de manera amigable
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleStatusChange = (newStatus) => {
    if (status === 'delivered' && newStatus === 'cancelled') {
      toast.error("No se puede actualizar el estado de una orden entregada");
      return;
    }
    updateStatusOrder(id, { status: newStatus });
  };//Fin de handleStatusChange

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-md text-gray-950 dark:text-gray-100 text-sm">
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-700 dark:text-gray-300">ID del Pedido:</span>
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{id.slice(-8)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Estatus del pedido:</span>
        {
        isAdmin ? (
          <SelectOrderStatus status={status}
            onChange={handleStatusChange}
          />
        ) : <OrderStatus  
        status={status}
        showLabel={true}
        />
        }
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Cantidad de Productos:</span>
        <span className="font-medium">{quantity}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">IVA:</span>
        <span className="font-medium">${iva.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
        <span className="font-bold text-gray-800 dark:text-gray-200">Total:</span>
        <span className="font-bold text-lg text-green-600 dark:text-green-400">${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Fecha del pedido:</span>
        <span className="font-medium text-sm">{formatDate(orderDate)}</span>
      </div>
    </div>
  );
}

export default OrderInfo;