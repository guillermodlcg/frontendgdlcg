import React, { useEffect, useState } from "react";
import { useOrders } from "../context/OrderContext";
import OrderCard from "../components/OrderCard";
import { Package, CheckCircle, Clock, DollarSign, PackageSearch } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const STATUS_TABS = [
  { label: "Todos",      value: null },
  { label: "Entregado",  value: "delivered" },
  { label: "Pendiente",  value: "received" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Cancelado",  value: "cancelled" },
];

function AdminOrdersPage() {
  const { getOrders, orders } = useOrders();
  const [activeTab, setActiveTab] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => { getOrders?.(); }, []);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const fmt = (n) => Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 });

  const totalIngresos = orders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
  const entregadas = orders?.filter(o => o.status === "delivered").length || 0;
  const pendientes = orders?.filter(o => o.status === "received").length || 0;

  const filtered = activeTab === null ? orders : orders?.filter(o => o.status === activeTab);

  const STATS = [
    { icon: <Package size={20} color="#7eb3e8" />, label: "TOTAL DE ÓRDENES", value: orders?.length || 0 },
    { icon: <CheckCircle size={20} color="#4ade80" />, label: "ENTREGADAS", value: entregadas },
    { icon: <Clock size={20} color="#fbbf24" />, label: "PENDIENTES", value: pendientes },
    { icon: <DollarSign size={20} color="#c084fc" />, label: "INGRESOS", value: `$${fmt(totalIngresos)}` },
  ];

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh" }}>

      {/* Header oscuro */}
      <div style={{ background: "#0f1f35", padding: isMobile ? "32px 16px 28px" : "60px 64px 48px" }}>
        <p style={DM(11, 600, { color: "#7eb3e8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 })}>
          PANEL DE ADMINISTRACIÓN
        </p>
        <h1 style={BC("40px", { color: "#fff", margin: "0 0 8px" })}>GESTIÓN DE ÓRDENES</h1>
        <p style={DM(14, 400, { color: "rgba(255,255,255,0.5)", margin: "0 0 40px" })}>
          Administra y revisa todas las órdenes del sistema
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: isMobile ? "14px 16px" : "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {s.icon}
                <span style={DM(10, 600, { color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" })}>{s.label}</span>
              </div>
              <p style={BC("32px", { color: "#fff", margin: 0 })}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs filtro */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e0d8", padding: isMobile ? "0 16px" : "0 64px" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.label} onClick={() => setActiveTab(tab.value)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "16px 20px",
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
            <p style={BC("24px", { color: "#0f1f35", margin: 0 })}>NO HAY ÓRDENES</p>
            <p style={DM(13, 400, { color: "#8a9bb0" })}>
              {activeTab === null ? "Cuando haya órdenes, aparecerán aquí." : `No hay órdenes con estado "${STATUS_TABS.find(t => t.value === activeTab)?.label}".`}
            </p>
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

export default AdminOrdersPage;
