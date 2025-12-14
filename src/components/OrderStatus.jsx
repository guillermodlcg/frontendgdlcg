import React from "react";
import { FaBox, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

function OrderStatus({ status, showLabel }) {
  // Objeto de mapeo para los iconos y colores
  const statusConfig = {
    received: {
      icon: FaBox,
      color: "text-blue-500",
      label: "Recibido",
    },
    confirmed: {
      icon: FaCheckCircle,
      color: "text-green-500",
      label: "Confirmado",
    },
    cancelled: {
      icon: FaTimesCircle,
      color: "text-red-500",
      label: "Cancelado",
    },
    delivered: {
      icon: FaTruck,
      color: "text-purple-500",
      label: "Entregado",
    },
  };

  const config = statusConfig[status];

  // Si el status no existe en la configuración, retornar un valor por defecto
  if (!config) {
    return (
      <span className="inline-flex items-center text-gray-500">
        <FaBox size={20} className="mr-1" />
        {showLabel && <span>Estado desconocido</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <config.icon size={20} className={`${config.color} mr-1`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export default OrderStatus;