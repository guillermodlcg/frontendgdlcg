import React from "react";
import { IoCartOutline } from "react-icons/io5"
import { useProducts } from "../context/ProductContext";
import { GiConfirmed } from 'react-icons/gi';
import Tooltip from '@mui/material/Tooltip';
 

function CartResume() {
    const { cart, updateStepOrder, getTotalProducts, 
            calculateSubTotal, calculateIva, calculateTotal
     } = useProducts();
    
    //Funcion para confirmar una orden 
    const confirmOrder = ()=>{
        updateStepOrder(2);
    };//Fin de confirmOrder


    return (
        <div className="max-w-4xl mx-auto">
            <div className='bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden'>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h2 className="flex justify-between items-center text-xl font-bold text-white">
                        <span className="flex items-center gap-2">
                            <IoCartOutline size={28} />
                            Resumen de Compra
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {getTotalProducts()} items
                        </span>
                    </h2>
                </div>
                
                <div className="p-6">
                    {
                        cart.length > 0 ? (
                            <div className="space-y-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold border-b-2 border-gray-200 dark:border-gray-700">
                                                <th className="py-3 text-left">Cantidad</th>
                                                <th className="py-3 text-left">Producto</th>
                                                <th className="py-3 text-right">Precio</th>
                                                <th className="py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-700 dark:text-gray-300 text-sm'>
                                            {
                                                cart.map((product) => (
                                                    <tr key={product._id}
                                                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                    >
                                                        <td className="py-4 font-semibold">{product.toSell}</td>
                                                        <td className="py-4 font-medium">{product.name}</td>
                                                        <td className="py-4 text-right">${product.price}</td>
                                                        <td className='py-4 text-right font-semibold'>
                                                            ${(product.toSell * product.price).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-3">
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
                                </div>
                                
                                <div className="flex justify-end">
                                    <Tooltip title="Confirmar y continuar">
                                        <button 
                                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            onClick={confirmOrder}
                                        >
                                            Confirmar
                                            <GiConfirmed size={24}/>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <IoCartOutline className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={64} />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    El carrito está vacío
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                    Agregue productos para poder procesar la orden
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CartResume
