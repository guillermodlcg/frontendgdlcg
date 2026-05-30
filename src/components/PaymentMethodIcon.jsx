import React from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaStore,
} from "react-icons/fa";

function PaymentMethodIcon({ method }) {
  const paymentMethods = {
    card: {
      icon: FaCreditCard,
      color: "text-indigo-500",
      label: "Tarjeta",
    },
    card_stripe: {
      icon: FaCreditCard,
      color: "text-indigo-500",
      label: "Tarjeta (Stripe)",
    },
    cash: {
      icon: FaMoneyBillWave,
      color: "text-green-500",
      label: "Efectivo",
    },
    transfer: {
      icon: FaExchangeAlt,
      color: "text-blue-500",
      label: "Transferencia",
    },
    pickup: {
      icon: FaStore,
      color: "text-yellow-500",
      label: "Recoger en tienda",
    },
  };

  const config = paymentMethods[method];

  if (!config) {
    return <span style={{ color: "#8a9bb0", fontSize: 13 }}>{method || "Sin método"}</span>;
  }

  const IconComponent = config.icon;

  return (
    <span className="inline-flex items-center">
      <IconComponent size={20} className={`${config.color} mr-1`} />
      <span className={config.color}>{config.label}</span>
    </span>
  );
}

export default PaymentMethodIcon;
