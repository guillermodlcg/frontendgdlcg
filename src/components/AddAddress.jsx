import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../schemas/addressSchema";
import { IoPersonOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { useProducts } from "../context/ProductContext";
import ConfirmModal from "./ConfirmModal";
import React, { useState } from "react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const INPUT_STYLE = (hasError) => ({
  width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
  background: "#fafaf8", border: `1px solid ${hasError ? "#dc2626" : "#e5e0d8"}`,
  borderRadius: 6, outline: "none", boxSizing: "border-box",
  ...DM(13, 400, { color: "#0f1f35" }),
});

function AddAddress() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(addressSchema) });
  const { updateAddress, updateStepOrder } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = handleSubmit((values) => {
    updateAddress(values);
    updateStepOrder(4);
  });

  const reviewPayment = () => { updateStepOrder(2); };

  const fields = [
    { name: "name",    label: "Nombre completo",    placeholder: "Nombre completo",       icon: <IoPersonOutline size={16} color="#8a9bb0" />,  error: errors.name },
    { name: "address", label: "Dirección",           placeholder: "Calle, número, colonia", icon: <FaRegAddressCard size={16} color="#8a9bb0" />, error: errors.address },
    { name: "phone",   label: "Teléfono",            placeholder: "Teléfono de contacto",  icon: <MdPhoneIphone size={16} color="#8a9bb0" />,    error: errors.phone },
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,31,53,0.08)" }}>

        {/* Header */}
        <div style={{ background: "#0f1f35", padding: "20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <FaRegAddressCard size={20} color="#7eb3e8" />
          <span style={BC("22px", { color: "#fff" })}>DIRECCIÓN DE ENVÍO</span>
        </div>

        {/* Campos */}
        <div style={{ padding: "28px" }}>
          {fields.map(field => (
            <div key={field.name} style={{ marginBottom: 20 }}>
              <label style={DM(10, 600, { textTransform: "uppercase", letterSpacing: "1.5px", color: "#8a9bb0", display: "block", marginBottom: 6 })}>
                {field.label}
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>{field.icon}</div>
                <input type="text" placeholder={field.placeholder}
                  style={INPUT_STYLE(field.error)}
                  {...register(field.name)}
                />
              </div>
              {field.error && <span style={DM(11, 400, { color: "#dc2626", display: "block", marginTop: 4 })}>{field.error.message}</span>}
            </div>
          ))}
        </div>

        {/* Footer botones */}
        <div style={{ borderTop: "1px solid #e5e0d8", padding: "16px 28px", display: "flex", justifyContent: "space-between", background: "#fafaf8" }}>
          <button type="button" onClick={reviewPayment}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e5e0d8", borderRadius: 6, padding: "10px 20px", cursor: "pointer", ...DM(12, 600, { color: "#0f1f35" }) }}>
            <GrFormPreviousLink size={18} /> Método de pago
          </button>
          <button type="button" onClick={() => setIsModalOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#0f1f35", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", transition: "background 0.15s", ...DM(12, 600, { color: "#fff" }) }}
            onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
            onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
            Finalizar Pedido <GrFormNextLink size={18} />
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

export default AddAddress;
