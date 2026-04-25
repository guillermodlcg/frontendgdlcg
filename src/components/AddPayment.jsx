import { useForm } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../schemas/paymentSchema";
import { IoCarOutline, IoPersonOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
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

function AddPayment() {
  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "pickup", cardNumber: "", cardName: "", expirationDate: "", ccv: "", userName: "" },
  });

  const { updatePayment, updateStepOrder } = useProducts();
  const { user } = useAuth();
  const [paymentType, setPaymenType] = useState("pickup");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paymentMethod = watch("paymentMethod");
  const cardNumber = watch("cardNumber");
  const expirationDate = watch("expirationDate");
  const ccv = watch("ccv");

  const handlePaymentMethodChange = (method) => {
    setValue("paymentMethod", method);
    setPaymenType(method);
  };

  const onSubmit = (data) => {
    if (paymentType === "card") {
      updatePayment({ paymentMethod, cardDetails: { cardName: data.cardName, cardNumber: data.cardNumber, expirationDate: data.expirationDate, ccv: data.ccv } });
      updateStepOrder(3);
    } else {
      updatePayment({ paymentMethod, userName: data.userName });
      updateStepOrder(4);
    }
  };

  const reviewConfirm = () => { updateStepOrder(1); };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ").slice(0, 19) : "";
  };

  const handleDateChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = val.length >= 3 ? val.slice(0, 2) + "/" + val.slice(2) : val;
    setValue("expirationDate", formatted);
    trigger("expirationDate");
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("cardNumber", formatted);
    setValue("cardNumberClean", formatted.replace(/\s/g, ""));
    trigger("cardNumber");
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,31,53,0.08)" }}>

        {/* Header */}
        <div style={{ background: "#0f1f35", padding: "20px 28px" }}>
          <span style={BC("22px", { color: "#fff" })}>MÉTODO DE PAGO</span>
        </div>

        <div style={{ padding: "28px" }}>

          {/* Selector de método */}
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

          {/* Tarjeta */}
          {paymentType === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p style={BC("16px", { color: "#0f1f35", margin: "0 0 4px", borderBottom: "1px solid #e5e0d8", paddingBottom: 10 })}>DATOS DE LA TARJETA</p>

              <div>
                <label style={LABEL_STYLE}>Número de tarjeta</label>
                <div style={{ position: "relative" }}>
                  <div style={ICON_WRAP}><IoCarOutline size={16} color="#8a9bb0" /></div>
                  <input type="text" placeholder="1234 5678 9012 3456" style={INPUT_STYLE(errors?.cardNumber)}
                    {...register("cardNumber")} onChange={handleCardNumberChange} value={cardNumber} />
                </div>
                {errors?.cardNumber && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{errors.cardNumber.message}</span>}
              </div>

              <div>
                <label style={LABEL_STYLE}>Nombre en la tarjeta</label>
                <div style={{ position: "relative" }}>
                  <div style={ICON_WRAP}><IoPersonOutline size={16} color="#8a9bb0" /></div>
                  <input type="text" placeholder="Juan Pérez" style={INPUT_STYLE(errors?.cardName)} {...register("cardName")} />
                </div>
                {errors?.cardName && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{errors.cardName.message}</span>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Fecha (mm/aa)</label>
                  <div style={{ position: "relative" }}>
                    <div style={ICON_WRAP}><BsCalendar2Date size={16} color="#8a9bb0" /></div>
                    <input type="text" placeholder="mm/aa" maxLength={5} style={INPUT_STYLE(errors?.expirationDate)}
                      value={expirationDate} {...register("expirationDate")} onChange={handleDateChange} onBlur={() => trigger("expirationDate")} />
                  </div>
                  {errors?.expirationDate && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{errors.expirationDate.message}</span>}
                </div>
                <div>
                  <label style={LABEL_STYLE}>CCV</label>
                  <div style={{ position: "relative" }}>
                    <div style={ICON_WRAP}><FaCcMastercard size={16} color="#8a9bb0" /></div>
                    <input type="text" maxLength={3} placeholder="123" style={INPUT_STYLE(errors?.ccv)}
                      value={ccv} {...register("ccv")} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 3); setValue("ccv", val); trigger("ccv"); }} />
                  </div>
                  {errors?.ccv && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{errors.ccv.message}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Pickup */}
          {paymentType === "pickup" && (
            <div>
              <label style={LABEL_STYLE}>Nombre del cliente</label>
              <div style={{ position: "relative" }}>
                <div style={ICON_WRAP}><IoPersonOutline size={16} color="#8a9bb0" /></div>
                <input type="text" value={user.username} placeholder="Nombre del cliente"
                  style={INPUT_STYLE(errors?.userName)} {...register("userName")} />
              </div>
              {errors?.userName && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{errors.userName.message}</span>}
            </div>
          )}
        </div>

        {/* Footer botones */}
        <div style={{ borderTop: "1px solid #e5e0d8", padding: "16px 28px", display: "flex", justifyContent: "space-between", background: "#fafaf8" }}>
          <button type="button" onClick={reviewConfirm}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e5e0d8", borderRadius: 6, padding: "10px 20px", cursor: "pointer", ...DM(12, 600, { color: "#0f1f35" }) }}>
            <GrFormPreviousLink size={18} /> Revisar Orden
          </button>
          <button type="button"
            onClick={() => { if (paymentType === "pickup") { setIsModalOpen(true); } else { handleSubmit(onSubmit)(); } }}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#0f1f35", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", transition: "background 0.15s", ...DM(12, 600, { color: "#fff" }) }}
            onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
            onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
            {paymentType === "pickup" ? "Finalizar pedido" : "Agregar dirección"} <GrFormNextLink size={18} />
          </button>
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
