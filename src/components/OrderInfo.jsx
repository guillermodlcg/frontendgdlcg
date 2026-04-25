import React from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import SelectOrderStatus from "./SelectOrderStatus";
import { toast } from "react-toastify";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const STATUS_BADGE = {
  delivered: { bg: "#dcfce7", color: "#15803d", label: "Entregado" },
  received:  { bg: "#fef9c3", color: "#854d0e", label: "Pendiente" },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8", label: "Confirmado" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelado" },
};

const ROW = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0ede8" };
const LABEL = DM("12px", 500, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px" });

function OrderInfo({ id, quantity, subtotal, iva, total, status, orderDate }) {
  const { isAdmin } = useAuth();
  const { updateStatusOrder } = useOrders();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  const handleStatusChange = (newStatus) => {
    if (status === "delivered" && newStatus === "cancelled") {
      toast.error("No se puede cancelar una orden ya entregada");
      return;
    }
    updateStatusOrder(id, { status: newStatus });
  };

  const badge = STATUS_BADGE[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={ROW}>
        <span style={LABEL}>ID del pedido</span>
        <span style={DM("13px", 500, { color: "#0f1f35", fontFamily: "monospace", background: "#f5f4f1", padding: "3px 8px", borderRadius: 4 })}>
          {id.slice(-8).toUpperCase()}
        </span>
      </div>

      <div style={ROW}>
        <span style={LABEL}>Estado</span>
        {isAdmin ? (
          <SelectOrderStatus status={status} onChange={handleStatusChange} />
        ) : (
          <span style={{ background: badge.bg, color: badge.color, padding: "4px 12px", borderRadius: 20, ...DM("12px", 600) }}>
            {badge.label}
          </span>
        )}
      </div>

      <div style={ROW}>
        <span style={LABEL}>Cantidad de productos</span>
        <span style={DM("14px", 500, { color: "#0f1f35" })}>{quantity}</span>
      </div>

      <div style={ROW}>
        <span style={LABEL}>Subtotal</span>
        <span style={DM("14px", 500, { color: "#0f1f35" })}>${Number(subtotal).toFixed(2)}</span>
      </div>

      <div style={ROW}>
        <span style={LABEL}>IVA</span>
        <span style={DM("14px", 500, { color: "#0f1f35" })}>${Number(iva).toFixed(2)}</span>
      </div>

      <div style={{ ...ROW, borderBottom: "none", paddingTop: 16 }}>
        <span style={LABEL}>Total</span>
        <span style={BC("20px", { color: "#1d4b8a" })}>${Number(total).toFixed(2)}</span>
      </div>

      <div style={{ ...ROW, borderBottom: "none", paddingTop: 8 }}>
        <span style={LABEL}>Fecha del pedido</span>
        <span style={DM("13px", 400, { color: "#4a5568" })}>{formatDate(orderDate)}</span>
      </div>
    </div>
  );
}

export default OrderInfo;
