import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const STATUS_OPTIONS = [
  { value: "received",  label: "Pendiente",  bg: "#fef9c3", color: "#854d0e" },
  { value: "confirmed", label: "Confirmado", bg: "#dbeafe", color: "#1d4ed8" },
  { value: "delivered", label: "Entregado",  bg: "#dcfce7", color: "#15803d" },
  { value: "cancelled", label: "Cancelado",  bg: "#fee2e2", color: "#991b1b" },
];

function SelectOrderStatus({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(status);
  const ref = useRef(null);

  useEffect(() => { setSelected(status); }, [status]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isDisabled = status === "cancelled";
  const current = STATUS_OPTIONS.find(o => o.value === selected) || STATUS_OPTIONS[0];

  const handleSelect = (option) => {
    setSelected(option.value);
    setOpen(false);
    onChange(option.value);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => !isDisabled && setOpen(o => !o)}
        disabled={isDisabled}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: current.bg, color: current.color,
          border: `1px solid ${current.color}22`,
          padding: "4px 10px 4px 12px", borderRadius: 20,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.7 : 1,
          transition: "all 0.15s",
          ...DM("12px", 600),
        }}>
        {current.label}
        {!isDisabled && <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", border: "1px solid #e5e0d8",
          borderTop: "2px solid #1d4b8a",
          boxShadow: "0 8px 24px rgba(15,31,53,0.10)",
          zIndex: 100, minWidth: 160, padding: "6px 0",
        }}>
          {STATUS_OPTIONS.map(option => (
            <button key={option.value} onClick={() => handleSelect(option)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "9px 16px",
                background: selected === option.value ? "#f5f4f1" : "transparent",
                border: "none", cursor: "pointer",
                borderLeft: selected === option.value ? "3px solid #1d4b8a" : "3px solid transparent",
                transition: "all 0.15s",
                ...DM("13px", selected === option.value ? 600 : 400, { color: "#0f1f35", textAlign: "left" }),
              }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: option.color, flexShrink: 0 }} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectOrderStatus;
