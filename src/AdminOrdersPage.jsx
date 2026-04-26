import React, { useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { Package, Truck, Clock, DollarSign, X } from 'lucide-react';

const AdminOrdersPage = () => {
    const { orders, getOrders, updateStatusOrder, deleteOrder } = useOrders();

    useEffect(() => {
        getOrders();
    }, []);

    const stats = {
        total: orders.length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        pending: orders.filter(o => o.status === 'received' || o.status === 'confirmed').length,
        revenue: orders.reduce((acc, curr) => curr.status !== 'cancelled' ? acc + curr.total : acc, 0)
    };

    const handleStatusUpdate = async (id, status) => {
        await updateStatusOrder(id, { status });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta orden?')) {
            await deleteOrder(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">GESTIÓN DE ÓRDENES</h1>
                    <p className="text-gray-500">Panel de control administrativo para pedidos y facturación</p>
                </div>

                {/* Admin Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-blue-500 mb-3"><Package size={20} /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Órdenes</span></div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-green-500 mb-3"><Truck size={20} /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Entregadas</span></div>
                        <p className="text-3xl font-bold">{stats.delivered}</p>
                    </div>
                    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-amber-500 mb-3"><Clock size={20} /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pendientes</span></div>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-emerald-500 mb-3"><DollarSign size={20} /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Ingresos Totales</span></div>
                        <p className="text-3xl font-bold text-emerald-400">${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#0d1117] text-gray-400 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4 border-b border-gray-800">Orden / Fecha</th>
                                    <th className="p-4 border-b border-gray-800">Cliente</th>
                                    <th className="p-4 border-b border-gray-800">Total</th>
                                    <th className="p-4 border-b border-gray-800">Estado</th>
                                    <th className="p-4 border-b border-gray-800 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[#1c2128] transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-200">#{order._id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="text-gray-300 font-medium">{order.user?.username || 'Desconocido'}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-200">${order.total.toFixed(2)}</td>
                                        <td className="p-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-1 text-xs font-bold uppercase outline-none
                                                    ${order.status === 'received' ? 'text-blue-400' : 
                                                      order.status === 'confirmed' ? 'text-purple-400' : 
                                                      order.status === 'delivered' ? 'text-green-400' : 'text-red-400'}`}
                                            >
                                                <option value="received">Recibido</option>
                                                <option value="confirmed">Confirmado</option>
                                                <option value="delivered">Entregado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(order._id)}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                title="Eliminar"
                                            >
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-500">
                                            No se encontraron órdenes en el sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;