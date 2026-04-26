import CartResume from "../components/CartResume";
import AddAddress from "../components/AddAddress";
import AddPayment from "../components/AddPayment";
import { useProducts } from "../context/ProductContext";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useOrders } from "../context/OrderContext";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function SalesPage() {
  const {
    address, payment, cart, updateStepOrder, initOrder, stepOrder,
    clearCart, getTotalProducts, calculateSubTotal, calculateIva, calculateTotal,
  } = useProducts();

  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const isProcessing = useRef(false);

  const steps = ["Confirmar Pedido", "Información de pago", "Dirección de envío", "Finalizar"];

  useEffect(() => {
    if (stepOrder === 0) navigate("/getallproducts");
    initOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalizingSale = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    let paymentMethodData = {};
    if (payment.paymentMethod === "card") {
      paymentMethodData = { method: "card", cardDetails: payment.cardDetails, shippingAddress: address };
    } else {
      paymentMethodData = { method: "pickup", userName: payment.userName };
    }

    const subTotalValue = Number(calculateSubTotal || 0);
    const totalValue = Number(calculateTotal || 0);
    const ivaValue = Number(calculateIva(subTotalValue) || 0);

    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        productName: item.name || "Producto sin nombre",
        quantity: item.toSell.toString(),
        price: item.price.toString(),
        talla: item.talla || "Única",
        color: item.color || "Sin especificar",
      })),
      paymentMethod: paymentMethodData,
      totalProducts: getTotalProducts().toString(),
      subTotal: subTotalValue.toString(),
      total: totalValue.toString(),
      iva: ivaValue.toFixed(2),
      status: "received",
    };

    try {
      await createOrder(orderData);
      updateStepOrder(0);
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error al finalizar venta:", error);
    } finally {
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    if (stepOrder === 4) finalizingSale();
  }, [stepOrder]);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh", padding: "40px 16px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Stepper */}
        <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, padding: "20px 16px", marginBottom: 32, boxShadow: "0 2px 12px rgba(15,31,53,0.06)", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 280 }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: stepOrder >= index + 1 ? "#0f1f35" : "#f5f4f1",
                    border: stepOrder >= index + 1 ? "none" : "1px solid #e5e0d8",
                    flexShrink: 0,
                    ...BC("14px", { color: stepOrder >= index + 1 ? "#fff" : "#8a9bb0" }),
                  }}>
                    {index + 1}
                  </div>
                  <span style={DM(10, stepOrder >= index + 1 ? 600 : 400, {
                    color: stepOrder >= index + 1 ? "#0f1f35" : "#8a9bb0",
                    textAlign: "center", whiteSpace: "nowrap",
                  })}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: stepOrder > index + 1 ? "#0f1f35" : "#e5e0d8", margin: "0 4px", marginBottom: 28 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div>
          {stepOrder === 1 && <CartResume />}
          {stepOrder === 2 && <AddPayment />}
          {stepOrder === 3 && <AddAddress />}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
