import React from "react";
import { AlertTriangle } from "lucide-react";

const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });
const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, text, btnCancel, btnAccept }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            {/* Overlay */}
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,31,53,0.5)" }} />

            {/* Modal */}
            <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(15,31,53,0.2)", border: "1px solid #e5e0d8", overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "24px 24px 0", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <AlertTriangle size={22} color="#854d0e" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={BC("22px", { color: "#0f1f35", margin: "0 0 6px" })}>{title}</h3>
                        <p style={DM("13px", 400, { color: "#4a5568", lineHeight: 1.6, margin: 0 })}>{text}</p>
                    </div>
                </div>

                {/* Botones */}
                <div style={{ display: "flex", gap: 10, padding: "20px 24px", justifyContent: "flex-end", borderTop: "1px solid #e5e0d8", marginTop: 20, background: "#fafaf8" }}>
                    <button type="button" onClick={onClose}
                        style={{ padding: "10px 20px", background: "#fff", border: "1px solid #e5e0d8", borderRadius: 6, cursor: "pointer", transition: "background 0.15s", ...DM("13px", 600, { color: "#4a5568" }) }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5f4f1"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        {btnCancel}
                    </button>
                    <button type="button" onClick={onConfirm}
                        style={{ padding: "10px 20px", background: "#0f1f35", border: "none", borderRadius: 6, cursor: "pointer", transition: "background 0.15s", ...DM("13px", 600, { color: "#fff" }) }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
                        onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
                        {btnAccept}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
