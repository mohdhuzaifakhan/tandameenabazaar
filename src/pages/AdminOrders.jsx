import React, { useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useBazaar();
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Completed' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter by status tab
  const tabFiltered = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  // Filter by search query
  const filteredOrders = tabFiltered.filter(order => {
    const id = order.id || '';
    const product = order.productName || '';
    const shop = order.shopName || '';
    const customer = order.customerName || '';
    const phone = order.customerPhone || '';

    return id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.toLowerCase().includes(searchQuery.toLowerCase()) ||
           shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
           phone.includes(searchQuery);
  });

  const tabs = ['All', 'Pending', 'Completed', 'Cancelled'];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Lead Order ${orderId} status changed to ${newStatus}.`);
  };

  return (
    <DashboardLayout title="WhatsApp Lead Orders" role="admin">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-extrabold flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-black text-slate-900">Global Customer Lead Inquiries</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track WhatsApp inquiries generated across all Meena Bazaar stores.</p>
          </div>

          <div className="relative w-full max-w-xs">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search leads by ID, product, store, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          {tabs.map(tab => {
            const count = tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length;

            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab 
                    ? 'bg-emerald-950 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === tab ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lead Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Requested Product</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Merchant Store</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400 font-medium">
                    <i className="fa-solid fa-comments text-3xl mb-2 text-slate-300 block"></i>
                    No order leads found matching your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">{order.id}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{order.date}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">{order.productName}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-bold block">{order.customerName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{order.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{order.shopName}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-black">₹{order.price?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${order.customerPhone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                          title="Open WhatsApp Chat"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i>
                        </a>

                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1.5 outline-none text-slate-800 bg-slate-50 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
