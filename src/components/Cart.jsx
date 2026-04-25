import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { toast } from "react-toastify";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Shield, RotateCcw, Truck } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function Cart() {
  const { cart, incProduct, decProduct, removeProduct, getTotalProducts, calculateSubTotal, calculateIva, calculateTotal, updateStepOrder } = useProducts();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const handleProcess = () => { updateStepOrder(1); navigate("/sale"); };

  const incrementProduct = (product) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing.toSell === existing.quantity) { toast.warn("Stock máximo: " + existing.quantity); return; }
    incProduct(product._id);
    toast.success("Cantidad actualizada");
  };

  const decrementProduct = (product) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing.toSell > 1) { decProduct(product._id); toast.info("Cantidad decrementada"); }
    else { removeProduct(product._id); toast.warn("Producto eliminado del carrito"); }
  };

  const fmt = (n) => Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 });
  const subtotal = calculateSubTotal || 0;
  const iva = calculateIva(subtotal);
  const total = calculateTotal || 0;

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh", padding: isMobile ? "24px 16px" : "40px 64px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={DM(11, 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 })}>Tu carrito</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <h1 style={BC("40px", { color: "#0f1f35", margin: 0 })}>CARRITO DE COMPRAS</h1>
          <span style={{ background: "#eef2f8", color: "#1d4b8a", borderRadius: 20, padding: "4px 12px", ...DM(12, 500) }}>
            {getTotalProducts()} productos
          </span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
          <ShoppingCart size={64} color="#e5e0d8" />
          <h2 style={BC("28px", { color: "#0f1f35", margin: 0 })}>TU CARRITO ESTÁ VACÍO</h2>
          <p style={DM(14, 400, { color: "#8a9bb0" })}>Agrega productos para comenzar tu compra</p>
          <Link to="/getallproducts" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0f1f35", color: "#fff", padding: "12px 24px", borderRadius: 6, textDecoration: "none", ...DM(13, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
            Ver Colección <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 380px", gap: isMobile ? 24 : 40, alignItems: "start" }}>

          {/* Lista productos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map(product => (
              <div key={product._id} style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, padding: isMobile ? 12 : 20, display: "flex", gap: isMobile ? 10 : 16, alignItems: isMobile ? "flex-start" : "center" }}>
                <img src={product.image} alt={product.name} style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, objectFit: "cover", borderRadius: 6, background: "#f0ede8", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={BC(isMobile ? "14px" : "16px", { color: "#0f1f35", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{product.name}</p>
                  <p style={DM(11, 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" })}>{product.categoria}</p>
                  {product.talla && <p style={DM(12, 400, { color: "#8a9bb0", margin: 0 })}>Talla: {product.talla}</p>}
                  {/* En móvil: controles + precio debajo del nombre */}
                  {isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => decrementProduct(product)}
                          style={{ width: 36, height: 36, border: "1px solid #e5e0d8", background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Minus size={13} color="#4a5568" />
                        </button>
                        <span style={DM(15, 600, { color: "#0f1f35", minWidth: 20, textAlign: "center" })}>{product.toSell}</span>
                        <button onClick={() => incrementProduct(product)}
                          style={{ width: 36, height: 36, border: "1px solid #e5e0d8", background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Plus size={13} color="#4a5568" />
                        </button>
                      </div>
                      <p style={BC("16px", { color: "#0f1f35", margin: 0 })}>${fmt(product.price * product.toSell)}</p>
                      <button onClick={() => { removeProduct(product._id); toast.warn("Producto eliminado"); }}
                        style={{ width: 36, height: 36, border: "1px solid #fca5a5", background: "transparent", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Trash2 size={15} color="#e53e3e" />
                      </button>
                    </div>
                  )}
                </div>
                {/* En desktop: controles a la derecha */}
                {!isMobile && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => decrementProduct(product)}
                        style={{ width: 44, height: 44, border: "1px solid #e5e0d8", background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0ede8"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <Minus size={14} color="#4a5568" />
                      </button>
                      <span style={DM(16, 600, { color: "#0f1f35", minWidth: 24, textAlign: "center" })}>{product.toSell}</span>
                      <button onClick={() => incrementProduct(product)}
                        style={{ width: 44, height: 44, border: "1px solid #e5e0d8", background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0ede8"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <Plus size={14} color="#4a5568" />
                      </button>
                    </div>
                    <p style={BC("18px", { color: "#0f1f35", margin: 0, minWidth: 80, textAlign: "right" })}>
                      ${fmt(product.price * product.toSell)}
                    </p>
                    <button onClick={() => { removeProduct(product._id); toast.warn("Producto eliminado"); }}
                      style={{ width: 44, height: 44, border: "1px solid #fca5a5", background: "transparent", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Trash2 size={16} color="#e53e3e" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, padding: 28, position: isMobile ? "static" : "sticky", top: 24 }}>
            <h2 style={BC("20px", { color: "#0f1f35", margin: "0 0 16px" })}>RESUMEN DEL PEDIDO</h2>
            <div style={{ borderTop: "1px solid #e5e0d8", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={DM(13, 400, { color: "#8a9bb0" })}>Total de productos</span>
                <span style={DM(13, 600, { color: "#0f1f35" })}>{getTotalProducts()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={DM(13, 400, { color: "#8a9bb0" })}>Subtotal</span>
                <span style={DM(13, 600, { color: "#0f1f35" })}>${fmt(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={DM(13, 400, { color: "#8a9bb0" })}>IVA (16%)</span>
                <span style={DM(13, 600, { color: "#0f1f35" })}>${fmt(iva)}</span>
              </div>
              <div style={{ borderTop: "1px solid #e5e0d8", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={BC("16px", { color: "#0f1f35" })}>TOTAL</span>
                <span style={BC("28px", { color: "#1d4b8a" })}>${fmt(total)}</span>
              </div>
            </div>

            <button onClick={handleProcess}
              style={{ width: "100%", background: "#0f1f35", color: "#fff", border: "none", borderRadius: 6, padding: 18, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", ...DM(13, 600, { letterSpacing: "2px", textTransform: "uppercase" }) }}
              onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
              onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
              <ShoppingBag size={16} /> PROCESAR COMPRA
            </button>

            <div style={{ textAlign: "center", marginTop: 14 }}>
              <Link to="/getallproducts" style={{ display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none", ...DM(12, 400, { color: "#1d4b8a" }) }}>
                Continuar comprando <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ marginTop: 20, borderTop: "1px solid #e5e0d8", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Shield size={14} color="#8a9bb0" />, text: "Pago 100% seguro" },
                { icon: <RotateCcw size={14} color="#8a9bb0" />, text: "Devoluciones en 30 días" },
                { icon: <Truck size={14} color="#8a9bb0" />, text: "Envío express disponible" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.icon}
                  <span style={DM(12, 400, { color: "#8a9bb0" })}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
