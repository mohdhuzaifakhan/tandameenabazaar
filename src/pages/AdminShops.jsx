import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminShops() {
  const { shops, products, toggleShopVerification } = useBazaar();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'verified' | 'pending'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Shops
  const filteredShops = shops.filter(shop => {
    const name = shop.name || '';
    const market = shop.market || '';
    const category = shop.category || shop.categoryName || '';

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          market.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'verified' && shop.verified) || 
                          (statusFilter === 'pending' && !shop.verified);

    return matchesSearch && matchesStatus;
  });

  const handleToggleVerification = (shop) => {
    toggleShopVerification(shop.id);
    const newStatus = !shop.verified ? 'Verified' : 'Pending Verification';
    showToast(`Store "${shop.name}" status changed to ${newStatus}.`);
  };

  return (
    <DashboardLayout title="Shops Directory Management" role="admin">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-3.5 sm:p-4 rounded-2xl shadow-2xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-extrabold flex items-center gap-3 animate-bounce max-w-md mx-auto">
          <i className="fa-solid fa-circle-check text-emerald-400 text-base flex-shrink-0"></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-xs flex flex-col gap-5 sm:gap-6 animate-fade-in">
        
        {/* Header Search & Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">Registered Stores Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage merchant verifications, storefront details, and catalog audits.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text" 
                placeholder="Search store, market, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 font-medium cursor-pointer"
            >
              <option value="all">All Statuses ({shops.length})</option>
              <option value="verified">Verified ({shops.filter(s => s.verified).length})</option>
              <option value="pending">Pending ({shops.filter(s => !s.verified).length})</option>
            </select>
          </div>
        </div>

        {/* Mobile Directory Card View (Visible on small screens) */}
        <div className="block md:hidden space-y-3.5">
          {filteredShops.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium">
              <i className="fa-solid fa-store-slash text-3xl mb-2 text-slate-300 block"></i>
              No shops match your search criteria.
            </div>
          ) : (
            filteredShops.map(shop => {
              const shopProdsCount = products.filter(p => p.shopId === shop.id).length;

              return (
                <div key={shop.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <img 
                      src={shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=200'} 
                      alt={shop.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-900 font-extrabold text-sm truncate">{shop.name}</strong>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex-shrink-0 ${
                          shop.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {shop.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Phone: {shop.phone || 'N/A'}</p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                        <span className="bg-slate-200/70 text-slate-700 font-semibold px-2 py-0.5 rounded-md">{shop.market || 'Main Market'}</span>
                        <span className="bg-emerald-100/70 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">{shop.category || shop.categoryName || 'General'}</span>
                        <span className="bg-slate-900 text-white font-bold px-2 py-0.5 rounded-md">{shopProdsCount} Products</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 mt-1">
                    <button 
                      onClick={() => handleToggleVerification(shop)}
                      className={`py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors text-center ${
                        shop.verified 
                          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' 
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {shop.verified ? 'Suspend' : 'Approve'}
                    </button>

                    <Link 
                      to={`/dashboard/admin/shop/${shop.id}`}
                      className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      Audit Store <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Directory Data Table (Visible on medium+ screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-4">Storefront Details</th>
                <th className="py-3.5 px-4">Market Area</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Listed Products</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    <i className="fa-solid fa-store-slash text-3xl mb-2 text-slate-300 block"></i>
                    No shops match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredShops.map(shop => {
                  const shopProdsCount = products.filter(p => p.shopId === shop.id).length;

                  return (
                    <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=200'} 
                            alt={shop.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" 
                          />
                          <div>
                            <strong className="text-slate-900 font-bold block text-xs">{shop.name}</strong>
                            <span className="text-[10px] text-slate-400">Phone: {shop.phone || 'N/A'} &bull; Rating: {shop.rating || 5.0} ★</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{shop.market || 'Main Market'}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{shop.category || shop.categoryName || 'General'}</td>
                      <td className="py-3.5 px-4 text-slate-900 font-bold">{shopProdsCount} Products</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          shop.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {shop.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          <button 
                            onClick={() => handleToggleVerification(shop)}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold cursor-pointer transition-colors ${
                              shop.verified 
                                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' 
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {shop.verified ? 'Suspend' : 'Approve'}
                          </button>

                          <Link 
                            to={`/dashboard/admin/shop/${shop.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                          >
                            Audit <i className="fa-solid fa-chevron-right text-[8px]"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
