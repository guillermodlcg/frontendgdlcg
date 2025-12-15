import OrderStatus from "./OrderStatus";
import React, { useState, useEffect } from "react";

function SelectOrderStatus({ status, onChange }) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const selectOptions = [
    { label: "Recibido", value: "received" },
    { label: "Confirmado", value: "confirmed" },
    { label: "Cancelado", value: "cancelled" },
    { label: "Entregado", value: "delivered" },
  ];

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  //Si el estado es cancelled , deshabilitamos el select
  const isDisabled = status === "cancelled";

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    onChange(newStatus);
  };

  return (
    <div className="flex items-center space-x-3">
      <select
        value={selectedStatus}
        disabled={isDisabled}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-white dark:bg-gray-700">
            {option.label}
          </option>
        ))}
      </select>
      <OrderStatus status={selectedStatus} showLabel={false} />
    </div>
  );
}

export default SelectOrderStatus;