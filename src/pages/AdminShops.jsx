import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

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

      <div className="sm:p-6 flex flex-col gap-5 sm:gap-6 animate-fade-in">

        {/* Header Search & Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">Registered Shops</h1>
            <p className="text-xs text-slate-500 mt-0.5">Shops management.</p>
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
                <div key={shop.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white flex flex-col gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={shop.image || shop.logoImage || DEFAULT_STORE_LOGO}
                      alt={shop.name}
                      onError={(e) => { e.target.src = DEFAULT_STORE_LOGO; }}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0 bg-slate-50"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-900 font-black text-sm truncate">{shop.name}</strong>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase flex-shrink-0 ${shop.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                          {shop.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Phone: {shop.phone || 'N/A'}</p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">{shop.market || 'Main Market'}</span>
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md">{shop.categoryName || shop.category || 'General'}</span>
                        <span className="bg-slate-900 text-white font-bold px-2 py-0.5 rounded-md">{shopProdsCount} Products</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => handleToggleVerification(shop)}
                      className={`py-2 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-colors text-center whitespace-nowrap ${shop.verified
                        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                      {shop.verified ? 'Unverify' : 'Verify'}
                    </button>

                    <Link
                      to={`/dashboard/admin/shop/${shop.id}`}
                      className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 text-center whitespace-nowrap shadow-2xs"
                    >
                      <span>Audit Store</span>
                      <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Directory Data Table (Visible on medium+ screens) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-black uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-4 min-w-[220px]">Storefront Details</th>
                <th className="py-4 px-4 min-w-[130px]">Market Area</th>
                <th className="py-4 px-4 min-w-[120px]">Category</th>
                <th className="py-4 px-4 min-w-[110px]">Listed Products</th>
                <th className="py-4 px-4 min-w-[140px]">Verification</th>
                <th className="py-4 px-4 text-right min-w-[200px]">Action Controls</th>
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
                    <tr key={shop.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={shop.image || shop.logoImage || DEFAULT_STORE_LOGO}
                            alt={shop.name}
                            onError={(e) => { e.target.src = DEFAULT_STORE_LOGO; }}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 flex-shrink-0 bg-slate-50 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <strong className="text-slate-900 font-extrabold block text-xs truncate">{shop.name}</strong>
                            <span className="text-[11px] text-slate-500 font-medium truncate block">Phone: {shop.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-semibold">{shop.market || 'Main Market'}</td>
                      <td className="py-4 px-4 text-slate-700 font-semibold">{shop.categoryName || shop.category || 'General'}</td>
                      <td className="py-4 px-4 text-slate-900 font-black">{shopProdsCount} Products</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${shop.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                          {shop.verified ? 'Verified (Published)' : 'Unverified (Hidden)'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          <button
                            onClick={() => handleToggleVerification(shop)}
                            className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-all whitespace-nowrap ${shop.verified
                              ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            title={shop.verified ? 'Unverify and hide Shop from public buyers' : 'Verify and publish Shop to public buyers'}
                          >
                            {shop.verified ? 'Unverify' : 'Verify'}
                          </button>

                          <Link
                            to={`/dashboard/admin/shop/${shop.id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] transition-all inline-flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                          >
                            <span>Audit Store</span>
                            <i className="fa-solid fa-chevron-right text-[8px]"></i>
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
