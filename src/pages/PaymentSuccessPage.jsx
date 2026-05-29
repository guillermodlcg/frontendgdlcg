import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fafaf8" }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(15,31,53,0.08)", padding: 40, maxWidth: 400, textAlign: "center" }}>
        <FaCheckCircle size={64} color="#0f1f35" style={{ marginBottom: 16 }} />
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 32, color: "#0f1f35", marginBottom: 12 }}>¡PAGO EXITOSO!</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#0f1f35", marginBottom: 24 }}>
          Tu pedido ha sido recibido y está siendo procesado.
        </p>
        <button
          onClick={() => navigate("/orders")}
          style={{ background: "#0f1f35", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(15,31,53,0.08)" }}
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  );
}
