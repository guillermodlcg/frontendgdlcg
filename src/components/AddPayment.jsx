import { useForm } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../schemas/paymentSchema";
import { IoPersonOutline } from "react-icons/io5";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { MdLock } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const INPUT_STYLE = (hasError) => ({
  width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
  background: "#fafaf8", border: `1px solid ${hasError ? "#dc2626" : "#e5e0d8"}`,
  borderRadius: 6, outline: "none", boxSizing: "border-box",
  ...DM(13, 400, { color: "#0f1f35" }),
});

const LABEL_STYLE = DM(10, 600, { textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a9bb0", display: "block", marginBottom: 6 });
const ICON_WRAP = { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" };

function AddPayment({ onStripeCheckout, onPickupConfirm }) {
  const { updatePayment, updateStepOrder } = useProducts();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "pickup",
      userName: user?.name || user?.username || "",
    },
  });

  useEffect(() => {
    if (user?.username || user?.name) {
      setValue("userName", user?.name || user?.username || "");
    }
  }, [user, setValue]);

  const [paymentType, setPaymenType] = useState("pickup");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setValue("paymentMethod", method);
    setPaymenType(method);
  };

  const handlePickupClick = async () => {
    const valid = await trigger("userName");
    if (valid) setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    updatePayment({ paymentMethod: "pickup", userName: data.userName });
    onPickupConfirm(data.userName); // pasa userName directo, sin depender del state
  };

  const reviewConfirm = () => { updateStepOrder(1); };

  const handleStripeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onStripeCheckout("card");
    } catch (err) {
      console.error("Error al iniciar pago con Stripe:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,31,53,0.08)" }}>

        <div style={{ background: "#0f1f35", padding: "20px 28px" }}>
          <span style={BC("22px", { color: "#fff" })}>MÉTODO DE PAGO</span>
        </div>

        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {[{ value: "pickup", label: "Recoger en tienda" }, { value: "card", label: "Pago con tarjeta" }].map(opt => (
              <button key={opt.value} type="button" onClick={() => handlePaymentMethodChange(opt.value)}
                style={{
                  flex: 1, padding: "12px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                  border: paymentType === opt.value ? "1.5px solid #0f1f35" : "1px solid #e5e0d8",
                  background: paymentType === opt.value ? "#0f1f35" : "#fafaf8",
                  ...DM(13, 600, { color: paymentType === opt.value ? "#fff" : "#4a5568" }),
                }}>
                {opt.label}
              </button>
            ))}
          </div>

          {paymentType === "card" && (
            <div style={{ background: "#f0f4ff", border: "1px solid #c7d7f5", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <MdLock size={28} color="#1d4b8a" style={{ flexShrink: 0 }} />
              <div>
                <p style={DM(13, 600, { color: "#0f1f35", margin: "0 0 4px" })}>Pago seguro con Stripe</p>
                <p style={DM(12, 400, { color: "#4a5568", margin: 0 })}>
                  Serás redirigido a Stripe para completar tu pago de forma segura. No almacenamos datos de tu tarjeta.
                </p>
              </div>
            </div>
          )}

          {paymentType === "pickup" && (
            <div>
              <label style={LABEL_STYLE}>Nombre del cliente</label>
              <div style={{ position: "relative" }}>
                <div style={ICON_WRAP}><IoPersonOutline size={16} color="#8a9bb0" /></div>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  style={INPUT_STYLE(errors?.userName)}
                  {...register("userName")}
                />
              </div>
              {errors?.userName && (
                <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>
                  {errors.userName.message}
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #e5e0d8", padding: "16px 28px", display: "flex", justifyContent: "space-between", background: "#fafaf8" }}>
          <button type="button" onClick={reviewConfirm}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e5e0d8", borderRadius: 6, padding: "10px 20px", cursor: "pointer", ...DM(12, 600, { color: "#0f1f35" }) }}>
            <GrFormPreviousLink size={18} /> Revisar Orden
          </button>

          {paymentType === "pickup" ? (
            <button type="button" onClick={handlePickupClick}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#0f1f35", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", transition: "background 0.15s", ...DM(12, 600, { color: "#fff" }) }}
              onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
              onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
              Finalizar pedido <GrFormNextLink size={18} />
            </button>
          ) : (
            <button type="button" onClick={handleStripeClick} disabled={isLoading}
              style={{ display: "flex", alignItems: "center", gap: 6, background: isLoading ? "#6b7a90" : "#0f1f35", border: "none", borderRadius: 6, padding: "10px 20px", cursor: isLoading ? "not-allowed" : "pointer", transition: "background 0.15s", ...DM(12, 600, { color: "#fff" }) }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#1d4b8a"; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#0f1f35"; }}>
              {isLoading ? "Redirigiendo..." : "Continuar al pago"} <GrFormNextLink size={18} />
            </button>
          )}
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit(onSubmit)}
          title="Confirmar Pedido"
          text="¿Estás seguro que deseas confirmar este pedido? Esta acción no se puede deshacer"
          btnAccept="Confirmar"
          btnCancel="Cancelar"
        />
      </div>
    </div>
  );
}

export default AddPayment;
