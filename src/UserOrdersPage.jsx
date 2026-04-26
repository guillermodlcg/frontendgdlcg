import React, { useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { Package, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

const UserOrdersPage = () => {
    const { orders, getOrders } = useOrders();

    useEffect(() => {
        getOrders();
    }, []);

    const stats = {
        total: orders.length,
        confirmed: orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length,
        pending: orders.filter(o => o.status === 'received').length
    };

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white px-4">
                <ShoppingBag size={80} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-navy-900 mb-2">No tienes pedidos aún</h2>
                <p className="text-gray-500 mb-8">Parece que aún no has realizado ninguna compra.</p>
                <Link to="/getallproducts" className="bg-navy-900 text-white px-8 py-3 rounded-full font-bold hover:bg-navy-800 transition-all shadow-lg text-sm">
                    Ver Colección
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-12">
                <div className="mb-10">
                    <span className="text-navy-600 font-bold tracking-widest text-xs uppercase block mb-2">Mis Pedidos</span>
                    <h1 className="text-4xl font-black text-navy-900 leading-none">MIS ÓRDENES</h1>
                    <p className="text-gray-400 mt-2 font-medium">Revisa el estado de tus pedidos</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center gap-5">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Package size={28} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Total Pedidos</p>
                            <p className="text-3xl font-black text-navy-900 leading-none mt-1">{stats.total}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center gap-5">
                        <div className="bg-green-50 p-4 rounded-2xl text-green-600"><CheckCircle size={28} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Confirmados</p>
                            <p className="text-3xl font-black text-navy-900 leading-none mt-1">{stats.confirmed}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center gap-5">
                        <div className="bg-amber-50 p-4 rounded-2xl text-amber-600"><Clock size={28} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Pendientes</p>
                            <p className="text-3xl font-black text-navy-900 leading-none mt-1">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-navy-900">Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                                        <p className="text-gray-400 text-sm font-medium mt-1">Realizado el {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-center
                                        ${order.status === 'received' ? 'bg-blue-100 text-blue-700' : 
                                          order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' : 
                                          order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {order.status === 'received' ? 'Recibido' : 
                                         order.status === 'confirmed' ? 'Confirmado' : 
                                         order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-navy-900 font-bold">{item.productId?.name || 'Producto'} <span className="text-gray-400 ml-2">x{item.quantity}</span></span>
                                            <span className="text-navy-900 font-black">${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6 border-t border-gray-50">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest space-y-1">
                                        <p>Subtotal: ${order.subTotal.toFixed(2)}</p>
                                        <p>IVA: ${order.iva.toFixed(2)}</p>
                                        <p className="text-navy-600 mt-2">Pago: {order.paymentMethod}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Pagado</p>
                                        <p className="text-4xl font-black text-navy-900 leading-none">${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOrdersPage;