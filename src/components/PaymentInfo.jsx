import React from "react";
import PaymentMethodIcon from "./PaymentMethodIcon";
import { IoCardOutline, IoPersonOutline, IoStorefrontOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa6";

const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const ROW = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f0ede8" };
const LABEL = { ...DM("11px", 500), color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 6 };
const VALUE = DM("13px", 500, { color: "#0f1f35" });

function PaymentInfo({ method, cardDetails, userName }) {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ ...ROW }}>
        <span style={LABEL}>Tipo de pago</span>
        <span><PaymentMethodIcon method={method} /></span>
      </div>

      {method === "card" && cardDetails && (
        <>
          <div style={ROW}>
            <span style={LABEL}><IoCardOutline size={14} /> Número de tarjeta</span>
            <span style={VALUE}>{cardDetails.cardNumber}</span>
          </div>
          <div style={ROW}>
            <span style={LABEL}><IoPersonOutline size={14} /> Nombre</span>
            <span style={VALUE}>{cardDetails.cardName}</span>
          </div>
          <div style={ROW}>
            <span style={LABEL}><BsCalendar2Date size={14} /> Expiración</span>
            <span style={VALUE}>{cardDetails.expirationDate}</span>
          </div>
          <div style={{ ...ROW, borderBottom: "none" }}>
            <span style={LABEL}><FaCcMastercard size={14} /> CCV</span>
            <span style={VALUE}>{cardDetails.ccv}</span>
          </div>
        </>
      )}

      {method === "pickup" && (
        <>
          <div style={ROW}>
            <span style={LABEL}><IoStorefrontOutline size={14} /> Método de entrega</span>
            <span style={VALUE}>Recoger en tienda</span>
          </div>
          <div style={{ ...ROW, borderBottom: "none" }}>
            <span style={LABEL}><IoPersonOutline size={14} /> Nombre de quien recoge</span>
            <span style={VALUE}>{userName}</span>
          </div>
        </>
      )}

      {method !== "card" && method !== "pickup" && (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          <span style={DM("13px", 400, { color: "#dc2626" })}>Método de pago no reconocido: {method}</span>
        </div>
      )}
    </div>
  );
}

export default PaymentInfo;
