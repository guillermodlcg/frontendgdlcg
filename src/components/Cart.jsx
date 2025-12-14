import React from "react";
import {
  IoBagCheckOutline,
  IoCartOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

function Cart() {
  const {
    cart,
    incProduct,
    decProduct,
    removeProduct,
    getTotalProducts,
    calculateSubTotal,
    calculateIva,
    calculateTotal,
    updateStepOrder,
  } = useProducts();
  const navigate = useNavigate();

  const handleProcess = () => {
    updateStepOrder(1);
    navigate("/sale");
  };

  //Función para incrementar la cantidad de productos del carrito
  const incrementProduct = (product) => {
    const existingProduct = cart.find(
      (cartItem) => cartItem._id === product._id
    );

    if (existingProduct.toSell == existingProduct.quantity) {
      //Ya existe el producto en el carrito, validamos que
      //no se exceda del maximo stock
      toast.warn(
        "Ha alcanzado el maximo de " +
          existingProduct.quantity +
          " productos en stock"
      );
      return;
    } else {
      //Si no ha alcanzado el maximo se incrementa la cantidad
      incProduct(product._id);
      toast.success("Producto agregado al carrito");
    }
    //Fin de else
  }; //Fin de incrementProduct

  //Funcion para decrementar la cantidad de productos en el carrito
  const decrementProduct = (product) => {
    const existingProduct = cart.find(
      (cartItem) => cartItem._id === product._id
    );

    if (existingProduct.toSell > 1) {
      //Ya existe el producto en el carrito, validamos que
      //se piueda decrementar
      decProduct(product._id);
      toast.info("Cantidad decrementada");
    } else {
      //Se elimina el producto
      removeProduct(product._id);
      toast.warn("Producto eliminado del carrito");
    }
    //Fin de else
  }; //Fin de incrementProduct

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="flex justify-between items-center text-xl font-bold text-white">
              <span className="flex items-center gap-2">
                <IoCartOutline size={28} />
                Carrito de Compras
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {getTotalProducts()} items
              </span>
            </h2>
          </div>
          <div className="p-6">
            {cart.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="py-3 text-left">Cantidad</th>
                      <th className="py-3 text-left">Producto</th>
                      <th className="py-3 text-right">Precio</th>
                      <th className="py-3 text-right">Total</th>
                      <th className="py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 text-sm">
                    {cart.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-bold"
                              onClick={() => decrementProduct(product)}
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-semibold">{product.toSell}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-bold"
                              onClick={() => incrementProduct(product)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 font-medium">{product.name}</td>
                        <td className="py-4 text-right">${product.price}</td>
                        <td className="py-4 text-right font-semibold">
                          ${(product.toSell * product.price).toFixed(2)}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            onClick={() => {
                              removeProduct(product._id);
                              toast.warn("Producto eliminado del carrito");
                            }}
                          >
                            <IoTrashBinOutline size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <IoCartOutline className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={64} />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  El carrito está vacío
                </p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total de productos</span>
                <span className="font-semibold text-gray-900 dark:text-white">{getTotalProducts()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${(calculateSubTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">IVA (16%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${calculateIva(calculateSubTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${(calculateTotal || 0).toFixed(2)}
                </span>
              </div>
              <Tooltip title="Procesar compra">
                <button
                  type="button"
                  disabled={getTotalProducts() === 0}
                  className={`w-full flex justify-center items-center gap-2 px-6 py-4 rounded-xl text-base font-semibold transition-all transform hover:scale-105 ${
                    getTotalProducts() === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  }`}
                  onClick={() => handleProcess()}
                >
                  Procesar compra
                  <IoBagCheckOutline size={24} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;