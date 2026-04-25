import React from "react";
import { IoCartOutline } from "react-icons/io5";
import { useProducts } from "../context/ProductContext";
import { GiConfirmed } from "react-icons/gi";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function CartResume() {
  const { cart, updateStepOrder, getTotalProducts, calculateSubTotal, calculateIva, calculateTotal } = useProducts();

  const confirmOrder = () => { updateStepOrder(2); };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,31,53,0.08)" }}>

        {/* Header */}
        <div style={{ background: "#0f1f35", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IoCartOutline size={22} color="#7eb3e8" />
            <span style={BC("22px", { color: "#fff" })}>RESUMEN DE COMPRA</span>
          </div>
          <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 12px", ...DM(11, 600, { color: "#7eb3e8" }) }}>
            {getTotalProducts()} items
          </span>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {cart.length > 0 ? (
            <>
              {/* Tabla */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e0d8" }}>
                    {["Cantidad", "Producto", "Precio", "Total"].map((h, i) => (
                      <th key={h} style={DM(10, 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", paddingBottom: 10, textAlign: i < 2 ? "left" : "right" })}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map(product => (
                    <tr key={product._id} style={{ borderBottom: "1px solid #f0ede8" }}>
                      <td style={DM(13, 600, { color: "#0f1f35", padding: "14px 0" })}>{product.toSell}</td>
                      <td style={DM(13, 400, { color: "#0f1f35", padding: "14px 0" })}>{product.name}</td>
                      <td style={DM(13, 400, { color: "#0f1f35", padding: "14px 0", textAlign: "right" })}>${product.price}</td>
                      <td style={DM(13, 600, { color: "#0f1f35", padding: "14px 0", textAlign: "right" })}>${(product.toSell * product.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales */}
              <div style={{ background: "#f5f4f1", borderRadius: 10, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Total de productos", value: getTotalProducts() },
                  { label: "Subtotal", value: `$${(calculateSubTotal || 0).toFixed(2)}` },
                  { label: "IVA (16%)", value: `$${calculateIva(calculateSubTotal || 0).toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={DM(12, 400, { color: "#8a9bb0" })}>{row.label}</span>
                    <span style={DM(13, 600, { color: "#0f1f35" })}>{row.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #e5e0d8", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={BC("20px", { color: "#0f1f35" })}>TOTAL</span>
                  <span style={BC("26px", { color: "#1d4b8a" })}>${(calculateTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Botón confirmar */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button onClick={confirmOrder}
                  style={{ background: "#0f1f35", color: "#fff", border: "none", borderRadius: 6, padding: "12px 28px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s", ...DM(12, 600, { textTransform: "uppercase", letterSpacing: "1.5px" }) }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
                  Confirmar <GiConfirmed size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <IoCartOutline size={56} color="#e5e0d8" style={{ marginBottom: 16 }} />
              <p style={BC("20px", { color: "#0f1f35", margin: "0 0 8px" })}>CARRITO VACÍO</p>
              <p style={DM(13, 400, { color: "#8a9bb0", margin: 0 })}>Agrega productos para poder procesar la orden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartResume;
