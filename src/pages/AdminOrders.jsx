import React, { useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useBazaar();
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Pending', 'Completed', 'Cancelled'
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Filter by status tab
  const tabFiltered = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  // Filter by search query
  const filteredOrders = tabFiltered.filter(order => 
    order.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    order.shopName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase())
  );

  const tabs = ['All', 'Pending', 'Completed', 'Cancelled'];

  return (
    <DashboardLayout title="WhatsApp Lead Orders" role="admin">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-6">
        
        {/* Tabs and search toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search leads..."
              value={searchOrderQuery}
              onChange={(e) => setSearchOrderQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/40"
            />
          </div>
        </div>

        {/* Lead Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <th className="p-3">Lead ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Product</th>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Merchant</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                    No leads found matching your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{order.id}</td>
                    <td className="p-3 text-slate-400 font-medium">{order.date}</td>
                    <td className="p-3 text-slate-800 font-semibold">{order.productName}</td>
                    <td className="p-3">
                      <strong className="text-slate-800 font-bold block">{order.customerName}</strong>
                      <span className="text-[10px] text-slate-400 font-semibold">{order.customerPhone}</span>
                    </td>
                    <td className="p-3 text-slate-500 font-semibold">{order.shopName}</td>
                    <td className="p-3 text-slate-800 font-bold">₹{order.price.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : order.status === 'Pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-slate-650 bg-slate-50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
