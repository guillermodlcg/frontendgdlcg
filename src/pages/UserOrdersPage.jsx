import React, { useEffect, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { Link } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { Package, CheckCircle, Clock, PackageSearch, ShoppingBag } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const STATUS_TABS = [
  { label: "Todos",      value: null },
  { label: "Pendiente",  value: "received" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Entregado",  value: "delivered" },
  { label: "Cancelado",  value: "cancelled" },
];

function UserOrdersPage() {
  const { getOrders, orders } = useOrders();
  const [activeTab, setActiveTab] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // iOS Safari: defer slightly to ensure token is available in storage
    const t = setTimeout(() => { getOrders?.(); }, 50);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const entregados = orders?.filter(o => o.status === "delivered").length || 0;
  const pendientes = orders?.filter(o => o.status === "received").length || 0;
  const confirmados = orders?.filter(o => o.status === "confirmed").length || 0;

  const filtered = activeTab === null ? orders : orders?.filter(o => o.status === activeTab);

  const STATS = [
    { icon: <Package size={18} color="#1d4b8a" />, label: "Total", value: orders?.length || 0 },
    { icon: <Clock size={18} color="#854d0e" />, label: "Pendientes", value: pendientes },
    { icon: <CheckCircle size={18} color="#15803d" />, label: "Entregados", value: entregados },
  ];

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh" }}>

      {/* Header claro */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e0d8", padding: isMobile ? "28px 16px" : "40px 64px" }}>
        <p style={DM(11, 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 })}>
          MIS PEDIDOS
        </p>
        <h1 style={BC("36px", { color: "#0f1f35", margin: "0 0 4px" })}>MIS ÓRDENES</h1>
        <p style={DM(13, 400, { color: "#8a9bb0", margin: "0 0 28px" })}>
          Revisa el estado de tus pedidos
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16, maxWidth: 560 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "#fafaf8", border: "1px solid #e5e0d8", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {s.icon}
                <span style={DM(10, 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px" })}>{s.label}</span>
              </div>
              <p style={BC("28px", { color: "#0f1f35", margin: 0 })}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs filtro */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e0d8", padding: isMobile ? "0 16px" : "0 64px" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.label} onClick={() => setActiveTab(tab.value)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "14px 18px",
              flexShrink: 0, whiteSpace: "nowrap",
              borderBottom: activeTab === tab.value ? "2px solid #1d4b8a" : "2px solid transparent",
              ...DM(13, activeTab === tab.value ? 600 : 400, { color: activeTab === tab.value ? "#0f1f35" : "#8a9bb0" })
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: isMobile ? "24px 16px" : "40px 64px" }}>
        {!filtered || filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16 }}>
            <PackageSearch size={48} color="#e5e0d8" />
            <p style={BC("24px", { color: "#0f1f35", margin: 0 })}>
              {activeTab === null ? "NO TIENES PEDIDOS AÚN" : `NO HAY PEDIDOS ${STATUS_TABS.find(t => t.value === activeTab)?.label.toUpperCase()}`}
            </p>
            <p style={DM(13, 400, { color: "#8a9bb0" })}>
              {activeTab === null ? "Cuando realices un pedido, aparecerá aquí." : `No tienes pedidos con estado "${STATUS_TABS.find(t => t.value === activeTab)?.label}".`}
            </p>
            {activeTab === null && (
              <Link to="/getallproducts" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0f1f35", color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none", ...DM(12, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
                <ShoppingBag size={16} /> Ver Colección
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))", gap: 24, alignItems: "start" }}>
            {filtered.map(order => (
              <OrderCard order={order} key={order._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrdersPage;
