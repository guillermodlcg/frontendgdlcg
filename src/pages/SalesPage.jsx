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
        quantity: item.toSell.toString(),
        price: item.price.toString(),
        talla: item.talla || 'Única',
        color: item.color || 'Sin especificar'
      })),
      paymentMethod: paymentMethodData,
      totalProducts: getTotalProducts().toString(),
      subTotal: subTotalValue.toString(),
      total: totalValue.toString(),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stepper mejorado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg transition-all z-10 ${
                      stepOrder >= index + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-110"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      stepOrder >= index + 1
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-1 -z-0 transition-all ${
                      stepOrder > index + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    style={{
                      transform: "translateY(-50%)",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
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
