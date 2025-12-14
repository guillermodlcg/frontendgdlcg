import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../schemas/addressSchema";
import { IoPersonOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Tooltip from "@mui/material/Tooltip";
import { useProducts } from "../context/ProductContext";
import ConfirmModal from "./ConfirmModal";
import React, { useState } from "react";

function AddAddress() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  });
  const { updateAddress, updateStepOrder } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = handleSubmit((values) => {
    updateAddress(values);
    updateStepOrder(4);
  }); //Fin de onSubmit

  //Funcion para inicializar un pedido
  const reviewPayment = () => {
    updateStepOrder(2);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaRegAddressCard size={28} />
            Dirección de envío
          </h1>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500"
                placeholder="Nombre completo"
                {...register("name")}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-500 pointer-events-none">
                <IoPersonOutline size={20} />
              </div>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500"
                placeholder="Calle, número, colonia"
                {...register("address")}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500 pointer-events-none">
                <FaRegAddressCard size={20} />
              </div>
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500"
                placeholder="Teléfono de contacto"
                {...register("phone")}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-indigo-500 pointer-events-none">
                <MdPhoneIphone size={20} />
              </div>
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </form>

        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-between items-center gap-4">
          <Tooltip title="Método de pago">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              onClick={reviewPayment}
              type="button"
            >
              <GrFormPreviousLink size={24} />
              Método de pago
            </button>
          </Tooltip>

          <Tooltip title="Finalizar pedido">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              Finalizar Pedido
              <GrFormNextLink size={24} />
            </button>
          </Tooltip>
          
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit(onSubmit)}
            title={"Confirmar Pedido"}
            text={"¿Estás seguro que deseas confirmar este pedido? Esta acción no se puede deshacer"}
            btnAccept={"Confirmar"}
            btnCancel={"Cancelar"}
          />
        </div>
      </div>
    </div>
  );
}

export default AddAddress;