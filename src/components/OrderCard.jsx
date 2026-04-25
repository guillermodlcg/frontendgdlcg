import React, { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import OrderInfo from "./OrderInfo";
import ShippingInfo from "./ShippingInfo";
import CartInfo from "./CartInfo";
import PaymentInfo from "./PaymentInfo";
import ConfirmModal from "./ConfirmModal";
import { XCircle, Trash2 } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const TAB_LABELS = {
  info: "Información",
  items: "Productos",
  payment: "Pago",
  shipping: "Envío",
};

function OrderCard({ order }) {
  const [activeTab, setActiveTab] = useState("info");
  const { updateStatusOrder, deleteOrder } = useOrders();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  if (!order) return null;

  const tabs = ["info", "items", "payment"];
  if (order.paymentMethod?.method === "card") tabs.push("shipping");

  const cancellOrder = (orderId) => {
    setIsModalOpen(false);
    updateStatusOrder(orderId, { status: "cancelled" });
  };

  const handleDeleteOrder = (orderId) => {
    setIsDeleteModalOpen(false);
    deleteOrder(orderId);
  };

  const isCancelled = order.status === "cancelled";

  return (
    <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e5e0d8", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: isMobile ? "14px 16px" : "20px 24px", borderBottom: "1px solid #e5e0d8" }}>
        {/* Fila: título + botones */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <p style={BC(isMobile ? "15px" : "18px", { color: "#0f1f35", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 })}>
            Pedido #{order._id.slice(-8).toUpperCase()}
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {!isCancelled && (
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: isMobile ? "5px 8px" : "6px 12px", background: "transparent", border: "1px solid #dc2626", color: "#dc2626", cursor: "pointer", flexShrink: 0, ...DM(isMobile ? "11px" : "12px", 600, { letterSpacing: "0.5px" }) }}>
                <XCircle size={13} /> {!isMobile && "Cancelar"}
              </button>
            )}
            {isAdmin && isCancelled && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: isMobile ? "5px 8px" : "6px 12px", background: "transparent", border: "1px solid #d1d5db", color: "#6b7280", cursor: "pointer", flexShrink: 0, ...DM(isMobile ? "11px" : "12px", 600, { letterSpacing: "0.5px" }) }}>
                <Trash2 size={13} /> {!isMobile && "Eliminar"}
              </button>
            )}
          </div>
        </div>

        {/* Info cliente (admin) */}
        {isAdmin && order.user && (
          <div style={{ background: "#f5f4f1", borderRadius: 8, padding: "8px 12px", marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={DM("12px", 500, { color: "#4a5568", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>
              <span style={{ color: "#8a9bb0" }}>Cliente: </span>{order.user.username || order.user.email}
            </span>
            <span style={DM("11px", 400, { color: "#8a9bb0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{order.user.email}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#f5f4f1", borderBottom: "1px solid #e5e0d8", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flexShrink: 0, padding: "10px 12px", border: "none", cursor: "pointer",
            background: activeTab === tab ? "#fff" : "transparent",
            borderBottom: activeTab === tab ? "2px solid #1d4b8a" : "2px solid transparent",
            whiteSpace: "nowrap",
            ...DM("11px", activeTab === tab ? 600 : 400, {
              color: activeTab === tab ? "#0f1f35" : "#8a9bb0",
              textTransform: "uppercase", letterSpacing: "0.5px",
            }),
          }}>
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div>
        {activeTab === "info" && (
          <OrderInfo
            id={order._id}
            quantity={order.totalProducts}
            subtotal={order.subTotal}
            iva={order.iva}
            total={order.total}
            status={order.status}
            orderDate={order.createdAt}
          />
        )}
        {activeTab === "items" && <CartInfo cart={order.items} />}
        {activeTab === "payment" && (
          <PaymentInfo
            method={order.paymentMethod.method}
            cardDetails={order.paymentMethod.cardDetails}
            userName={order.paymentMethod.userName}
          />
        )}
        {activeTab === "shipping" && order.paymentMethod?.method === "card" && (
          <ShippingInfo
            name={order.paymentMethod.shippingAddress.name}
            address={order.paymentMethod.shippingAddress.address}
            phone={order.paymentMethod.shippingAddress.phone}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => cancellOrder(order._id)}
        title="Cancelar pedido"
        text="¿Estás seguro que deseas cancelar este pedido? Esta acción no se puede deshacer."
        btnAccept="Confirmar"
        btnCancel="Cancelar"
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteOrder(order._id)}
        title="Eliminar orden"
        text="¿Estás seguro que deseas eliminar esta orden? Esta acción no se puede deshacer."
        btnAccept="Eliminar"
        btnCancel="Cancelar"
      />
    </div>
  );
}

export default OrderCard;
