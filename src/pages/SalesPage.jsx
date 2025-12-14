import CartResume from "../components/CartResume";
import AddAddress from "../components/AddAddress";
import AddPayment from "../components/AddPayment";
import { useProducts } from "../context/ProductContext";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useOrders } from "../context/OrderContext";


function SalesPage() {
  const {
    address,
    payment,
    cart,
    updateStepOrder,
    initOrder,
    stepOrder,
    clearCart,
    getTotalProducts,
    calculateSubTotal,
    calculateIva,
    calculateTotal,
  } = useProducts();

  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const isProcessing = useRef(false);

  const steps = [
    "Confirmar Pedido",
    "Agregar direccion",
    "Informacion de pago",
    "Finalizar",
  ];

  //Use effect que se ejecuta una sola vez
  //al iniciaizar el componente
  useEffect(() => {
    if (stepOrder === 0) navigate("/getallproducts");
    initOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //Fin de useEffect

  const finalizingSale = () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    //Crear el pedido
    let paymentMethodData = {};

    if (payment.paymentMethod === "card") {
      paymentMethodData = {
        method: "card",
        cardDetails: payment.cardDetails,
        shippingAddress: address,
      };
    } else {
      paymentMethodData = {
        method: "pickup",
        userName: payment.userName,
      };
    }

    const subTotalValue = Number(calculateSubTotal || 0);
    const totalValue = Number(calculateTotal || 0);
    const ivaValue = Number(calculateIva(subTotalValue) || 0);

    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        productName: item.name || 'Producto sin nombre',
        quantity: item.toSell.toFixed(0),
        price: item.price.toFixed(2),
        talla: item.talla || 'Única',
        color: item.color || 'Sin especificar'
      })),
      paymentMethod: paymentMethodData,
      totalProducts: getTotalProducts().toFixed(0),
      subTotal: subTotalValue.toFixed(2),
      total: totalValue.toFixed(2),
      iva: ivaValue.toFixed(2),
      status: "received",
    };

    console.log("ORDEN A ENVIAR --->", orderData);
    console.log("PAYMENT DATA --->", paymentMethodData);
    console.log("CARD DETAILS DEL CONTEXTO --->", payment);

    //Creamos la orden mandando los datos al api
    createOrder(orderData);

    //Reiniciamos el proceso del pedido al paso 0
    updateStepOrder(0);

    //Vaciamos el carrito
    clearCart();



    //Reset despues de un segundo
    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);

    //Navegamos hacia el listado de productos
    navigate("/getallproducts");
  }; //Fin de finalizingSale

  //Cuando el paso llegue a 4, finalizamos la venta
  useEffect(() => {
    if (stepOrder === 4) {
      finalizingSale();
    }
  }, [stepOrder]); //Fin de useEffect

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white
                  ${stepOrder >= index + 1 ? "bg-blue-500" : "bg-gray-300"}
                `}
              >
                {index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`absolute w-full h-1
                    ${stepOrder > index + 1 ? "bg-blue-500" : "bg-gray-300"}
                  `}
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-4">
        {stepOrder === 1 && <CartResume />}
        {stepOrder === 2 && <AddPayment />}
        {stepOrder === 3 && <AddAddress />}
      </div>
    </div>
  );
}

export default SalesPage;
