import React, { useState } from "react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const TH = { ...DM("10px", 600), color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 0 10px", textAlign: "left", borderBottom: "1px solid #e5e0d8" };

function CartInfo({ cart }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!cart || cart.length === 0) {
    return (
      <div style={{ padding: "32px 24px", textAlign: "center" }}>
        <p style={DM("13px", 400, { color: "#8a9bb0" })}>No hay productos en el pedido</p>
      </div>
    );
  }

  const grandTotal = cart.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div style={{ padding: "20px 24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={TH}>Cant.</th>
            <th style={TH}>Producto</th>
            <th style={TH}>Precio</th>
            <th style={{ ...TH, textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product, i) => (
            <tr key={i}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{ background: hoveredRow === i ? "#fafaf8" : "transparent", transition: "background 0.15s" }}>
              <td style={{ ...DM("13px", 400, { color: "#4a5568" }), padding: "10px 0", borderBottom: "1px solid #f0ede8" }}>
                {product.quantity}
              </td>
              <td style={{ ...DM("13px", 500, { color: "#0f1f35" }), padding: "10px 8px", borderBottom: "1px solid #f0ede8" }}>
                {product.productId?.name || product.productName || "—"}
              </td>
              <td style={{ ...DM("13px", 400, { color: "#4a5568" }), padding: "10px 0", borderBottom: "1px solid #f0ede8" }}>
                ${Number(product.price).toFixed(2)}
              </td>
              <td style={{ ...DM("13px", 500, { color: "#0f1f35" }), padding: "10px 0", borderBottom: "1px solid #f0ede8", textAlign: "right" }}>
                ${(product.quantity * product.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ paddingTop: 14, ...DM("12px", 500, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px" }) }}>
              Total
            </td>
            <td style={{ paddingTop: 14, textAlign: "right", ...BC("18px", { color: "#1d4b8a" }) }}>
              ${grandTotal.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default CartInfo;
