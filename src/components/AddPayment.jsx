import { useForm } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../schemas/paymentSchema";
import { IoCarOutline, IoPersonOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

function AddPayment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "pickup",
      cardNumber: "",
      cardName: "",
      expirationDate: "",
      ccv: "",
      userName: ""
    }
  });

  const { updatePayment, updateStepOrder } = useProducts();
  const { user } = useAuth();
  const [paymentType, setPaymenType] = useState("pickup");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Observar metodo de pago para detectar cambios
  const paymentMethod = watch("paymentMethod");
  const cardNumber = watch("cardNumber");
  const expirationDate = watch("expirationDate");
  const ccv = watch("ccv");

  const handlePaymentMethodChange = (method) => {
    if (method === "card") {
      setValue("paymentMethod", "card");
      setPaymenType("card");
    } else {
      setValue("paymentMethod", "pickup");
      setPaymenType("pickup");
    }
  }; //Fin de handlePaymentMethodChange

  //Funcion para guardar los datos del pago al hacer click en el boton
  const onSubmit = (data) => {
    if (paymentType === "card") {
      updatePayment({
        paymentMethod,
        cardDetails: {
          cardName: data.cardName,
          cardNumber: data.cardNumber,
          expirationDate: data.expirationDate,
          ccv: data.ccv,
        },
      });
      updateStepOrder(3);
    } else {
      updatePayment({
        paymentMethod,
        userName: data.userName,
      });
      updateStepOrder(4);
    }
  }; //Fin de onSubmit

  const reviewConfirm = () => {
    updateStepOrder(1);
  }; //Fin de reviewOrder

  //Funcion para formato de la tarjeta quitando espacios y aceptando solamente digitos
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ").slice(0, 19) : "";
  }; //Fin de formatCardNumber

  //Funcion para convertir la fecha en formato mm/yy
  const handleDateChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      val.length >= 3 ? val.slice(0, 2) + "/" + val.slice(2) : val;
    setValue("expirationDate", formatted);
    trigger("expirationDate");
  }; //Fin de handleDateChange

  //Funcion para controlar el cambio de numero de tarjeta y validarlo
  //Ademas de usar la funcion formatCardNumber para separar
  //los caracteres en grupos de 4
  const handleCardNumberChange = (e) => {
    const inputValue = e.target.value;

    const formatted = formatCardNumber(inputValue);
    setValue("cardNumber", formatted);

    const cleanValue = formatted.replace(/\s/g, "");
    setValue("cardNumberClean", cleanValue);
    trigger("cardNumber");
  }; //Fin de handleCardNumberChange

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Método de pago
          </h1>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Radio Buttons */}
          <div className="flex justify-center gap-12 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <input
                id="pickup"
                type="radio"
                value="pickup"
                {...register("paymentMethod")}
                checked={paymentMethod === "pickup"}
                onClick={() => handlePaymentMethodChange("pickup")}
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="pickup" className="text-gray-900 dark:text-white font-medium cursor-pointer select-none">
                Recoger en tienda
              </label>
            </div>

            <div className="flex items-center gap-4">
              <input
                id="card"
                type="radio"
                value="card"
                {...register("paymentMethod")}
                onClick={() => handlePaymentMethodChange("card")}
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="card" className="text-gray-900 dark:text-white font-medium cursor-pointer select-none">
                Pago con tarjeta
              </label>
            </div>
          </div>

          {/* Formulario para datos de la tarjeta */}
          {paymentType === "card" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">
                Datos de la tarjeta
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Numero de tarjeta */}
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("cardNumber")}
                      className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                      placeholder="1234 5678 9012 3456"
                      onChange={handleCardNumberChange}
                      value={cardNumber}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-indigo-500 pointer-events-none">
                      <IoCarOutline size={20} />
                    </div>
                  </div>
                  {errors?.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                {/* Nombre en la tarjeta */}
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre en la tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("cardName")}
                      className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Juan Pérez"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-green-500 pointer-events-none">
                      <IoPersonOutline size={20} />
                    </div>
                  </div>
                  {errors?.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Fecha de expiracion */}
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha (mm/aa)
                    </label>
                    <div className="relative">
                      <input
                        value={expirationDate}
                        type="text"
                        {...register("expirationDate")}
                        className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                        placeholder="mm/aa"
                        onChange={handleDateChange}
                        onBlur={() => trigger("expirationDate")}
                        maxLength={5}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500 pointer-events-none">
                        <BsCalendar2Date size={20} />
                      </div>
                    </div>
                    {errors?.expirationDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expirationDate.message}</p>
                    )}
                  </div>

                  {/* CCV de la tarjeta */}
                  <div>
                    <label htmlFor="ccv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CCV
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={3}
                        {...register("ccv")}
                        className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                        placeholder="123"
                        value={ccv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                          setValue("ccv", val);
                          trigger("ccv");
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-orange-500 pointer-events-none">
                        <FaCcMastercard size={20} />
                      </div>
                    </div>
                    {errors?.ccv && (
                      <p className="text-red-500 text-sm mt-1">{errors.ccv.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Formulario para recoger en tienda */}
          {paymentType === "pickup" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del cliente
                </label>
                <div className="relative">
                  <input
                    value={user.username}
                    type="text"
                    {...register("userName")}
                    className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nombre del cliente"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-green-500 pointer-events-none">
                    <IoPersonOutline size={20} />
                  </div>
                </div>
                {errors?.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-between items-center gap-4">
          <Tooltip title="Revisar Orden">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              onClick={reviewConfirm}
              type="button"
            >
              <GrFormPreviousLink size={24} />
              Revisar Orden
            </button>
          </Tooltip>
          
          <Tooltip title={paymentType === "pickup" ? "Finalizar pedido" : "Agregar dirección"}>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              type="button"
              onClick={() => {
                if (paymentType === "pickup") {
                  setIsModalOpen(true);
                } else {
                  handleSubmit(onSubmit)();
                }
              }}
            >
              {paymentType === "pickup" ? "Finalizar pedido" : "Agregar dirección"}
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

export default AddPayment;