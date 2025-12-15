import {
  IoReceiptOutline,
  IoCartOutline,
  IoRocketOutline,
  IoStorefrontOutline,
  IoPencil,
  IoPencilOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import OrderInfo from "./OrderInfo";
import ShippingInfo from "./ShippingInfo";
import CartInfo from "./CartInfo";
import PaymentInfo from "./PaymentInfo";
import React, { useState } from "react";
import { useOrders } from "../context/OrderContext";
import Tooltip from "@mui/material/Tooltip";
import { MdOutlineCancel } from "react-icons/md";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "../context/AuthContext";

function OrderCard({ order }) {
  const [activeTab, setActiveTab] = useState("info");
  const { updateStatusOrder, deleteOrder } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!order) {
    return <div>No hay datos de la orden</div>;
  }
  console.log(order);
  const tabs = [
    {
      label: "Información del pedido",
      value: "info",
      icon: <IoReceiptOutline size={20} className="mr-2" />,
      content: (
        <OrderInfo
          id={order._id}
          quantity={order.totalProducts}
          subtotal={order.subTotal}
          iva={order.iva}
          total={order.total}
          status={order.status}
          orderDate={order.createdAt}
        />
      ),
    },
    {
      label: "Productos del pedido",
      value: "items",
      icon: <IoCartOutline size={20} className="mr-2" />,
      content: <CartInfo cart={order.items} />,
    },
    {
      label: "Detalle de pago",
      value: "payment",
      icon: <IoStorefrontOutline size={20} className="mr-2" />,
      content: (
        <PaymentInfo
          method={order.paymentMethod.method}
          cardDetails={order.paymentMethod.cardDetails}
          userName={order.paymentMethod.userName}
        />
      ),
    },
  ]; //Fin de array tabs

  if (order.paymentMethod.method === "card") {
    const orderDetails = {
      label: "Datos de envío",
      value: "shipping",
      icon: <IoRocketOutline size={20} className="mr-2" />,
      content: (
        <ShippingInfo
          name={order.paymentMethod.shippingAddress.name}
          address={order.paymentMethod.shippingAddress.address}
          phone={order.paymentMethod.shippingAddress.phone}
        />
      ),
    };
    tabs.push(orderDetails);
  }

  const cancellOrder = (orderId) => {
    //console.log(orderId);
    setIsModalOpen(false);
    updateStatusOrder(orderId, { status: "cancelled" });
  }; //Fin de Cancell Order

  const handleDeleteOrder = (orderId) => {
    setIsDeleteModalOpen(false);
    deleteOrder(orderId);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-3">
              Pedido #{order._id.slice(-8)}
            </h2>
            {isAdmin && order.user && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300">
                <p className="mb-1"><span className="font-semibold text-gray-800 dark:text-gray-200">Cliente:</span> {order.user.username || order.user.email}</p>
                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Email:</span> {order.user.email}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Tooltip title="Cancelar Orden">
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <MdOutlineCancel size={20} />
              </button>
            </Tooltip>
            <ConfirmModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => cancellOrder(order._id)}
              title={"Cancelar pedido"}
              text={
                "¿Estas seguro que desas cancelar este pedido? Esta accion no se puede deshacer"
              }
              btnAccept={"Confirmar"}
              btnCancel={"Cancelar"}
            />
            {isAdmin && (
              <Tooltip title="Actualizar Status de Orden">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                  onClick={() => setActiveTab('info')}
                >
                  <IoPencilOutline size={20} />
                </button>
              </Tooltip>
            )}
            {isAdmin && order.status === "cancelled" && (
              <Tooltip title="Eliminar orden">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <IoTrashBinOutline size={20} />
                </button>
              </Tooltip>
            )}
            <ConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => handleDeleteOrder(order._id)}
              title={"Eliminar orden"}
              text={
                "¿Estas seguro que desas cancelar este pedido? Esta accion no se puede deshacer"
              }
              btnAccept={"Eliminar"}
              btnCancel={"Cancelar"}
            />
          </div>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === value
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              {icon} 
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-0">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}
export default OrderCard;