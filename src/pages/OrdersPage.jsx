import OrderCard from '../components/OrderCard';
import React, { useEffect } from 'react';
import { useOrders } from '../context/OrderContext';

function OrdersPage() {
  const { getOrders, orders } = useOrders();

  useEffect( ()=>{
    getOrders();
  }, [ ] );

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">No hay órdenes para mostrar</h1>
          <p className="text-gray-600 dark:text-gray-400">Cuando tengas órdenes, aparecerán aquí.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Gestión de Órdenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Administra y revisa todas las órdenes del sistema</p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center'>
          {
            orders.map( (order)=> (
              <OrderCard 
                order={order}
                key={order._id}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default OrdersPage;
