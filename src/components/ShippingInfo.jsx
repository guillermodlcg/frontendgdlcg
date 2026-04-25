import React from "react";
import { IoPersonOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";

const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const ROW = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid #f0ede8" };
const LABEL = { ...DM("11px", 500), color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 6 };
const VALUE = DM("13px", 500, { color: "#0f1f35" });

function ShippingInfo({ name, address, phone }) {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={ROW}>
        <span style={LABEL}><IoPersonOutline size={14} /> Nombre</span>
        <span style={VALUE}>{name}</span>
      </div>
      <div style={ROW}>
        <span style={LABEL}><FaRegAddressCard size={14} /> Dirección</span>
        <span style={{ ...VALUE, maxWidth: "60%", textAlign: "right" }}>{address}</span>
      </div>
      <div style={{ ...ROW, borderBottom: "none" }}>
        <span style={LABEL}><MdPhoneIphone size={14} /> Teléfono</span>
        <span style={VALUE}>{phone}</span>
      </div>
    </div>
  );
}

export default ShippingInfo;
