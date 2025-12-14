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
          quantity={order.quantity}
          subtotal={order.subTotal}
          iva={order.iva}
          total={order.totalProducts}
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
    <div className="w-full min-w-0 grow bg-white shadow-md rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex justify-around m-2">
          <div>
            <h2 className="text-xl font-semibold m-0 p-0 text-blue-700 text-center">
              Información del Pedido
            </h2>
          </div>
          <div>
            <Tooltip title="Cancelar Orden">
              <button
                className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-lg text-sm"
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
            <Tooltip
              title="Actualizar Status de Orden"
              className={isAdmin ? "" : "hidden"}
            >
              <button
                className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg text-sm"
                onClick={() => {}}
              >
                <IoPencilOutline size={20} />
              </button>
            </Tooltip>
            <Tooltip
              title="Eliminar orden"
              className={
                isAdmin && order.status === "cancelled" ? "" : "hidden"
              }
            >
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg text-sm m-1"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <IoTrashBinOutline size={20} />
              </button>
            </Tooltip>
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
        <div className="flex border-b">
          {tabs.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === value
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {icon} {label}
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