import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const { shops, products, orders, toggleShopVerification, categories, markets } = useBazaar();
  const [approvalTab, setApprovalTab] = useState('shops'); // 'shops' | 'products'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter pending shops
  const pendingShops = shops.filter(s => !s.verified);
  const verifiedShops = shops.filter(s => s.verified);

  // Compute platform live stats
  const totalShopsCount = shops.length;
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalCatalogValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const handleApproveShop = (shopId, shopName) => {
    toggleShopVerification(shopId);
    showToast(`Store "${shopName}" verification status updated.`);
  };

  return (
    <DashboardLayout title="Admin Overview" role="admin">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce ${
          toastMessage.type === 'error'
            ? 'bg-rose-950 text-rose-200 border-rose-800'
            : 'bg-emerald-950 text-emerald-200 border-emerald-800'
        }`}>
          <i className={`fa-solid ${toastMessage.type === 'error' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-check text-emerald-400'} text-base`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in pb-12">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Application Owner
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">
                {userProfile?.email || 'mohdhuzaifa8126195456@gmail.com'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Platform Command Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time ecosystem statistics & merchant verification portal</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/dashboard/admin/shops"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-store"></i> Stores Directory ({shops.length})
            </Link>
            <Link
              to="/dashboard/admin/orders"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-list-check"></i> Customer Leads ({orders.length})
            </Link>
          </div>
        </div>

        {/* Stats Grid - 6 live metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Total Shops */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-store"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Total Shops</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{totalShopsCount}</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">{verifiedShops.length} Verified</span>
            </div>
          </div>

          {/* Card 2: Products */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-box"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Live Products</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{totalProductsCount}</span>
              <span className="text-[9px] text-purple-600 font-bold mt-1 block">Active Catalog</span>
            </div>
          </div>

          {/* Card 3: Markets */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Market Hubs</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{markets.length}</span>
              <span className="text-[9px] text-blue-600 font-bold mt-1 block">Active Hubs</span>
            </div>
          </div>

          {/* Card 4: Categories */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Categories</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{categories.length}</span>
              <span className="text-[9px] text-orange-600 font-bold mt-1 block">Taxonomy</span>
            </div>
          </div>

          {/* Card 5: WhatsApp Leads */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Order Leads</span>
              <span className="text-base font-black text-slate-900 mt-1 block">{totalOrdersCount}</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">WhatsApp Enquiries</span>
            </div>
          </div>

          {/* Card 6: Catalog Value */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Inventory Value</span>
              <span className="text-base font-black text-slate-900 mt-1 block">₹{(totalCatalogValue / 1000).toFixed(0)}K</span>
              <span className="text-[9px] text-indigo-600 font-bold mt-1 block">Total Listed MRP</span>
            </div>
          </div>

        </div>

        {/* Pending Approvals & Platform Directory Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Pending Merchant Approvals Table (3/5 width) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 lg:col-span-3 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Merchant Verification Approvals</h3>
                  <p className="text-xs text-slate-400">Review newly registered storefronts requiring owner verification.</p>
                </div>

                <span className="px-3 py-1 bg-amber-50 text-amber-700 font-black text-xs rounded-full border border-amber-200">
                  {pendingShops.length} Pending
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="p-3">Store Info</th>
                      <th className="p-3">Market Area</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Status Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingShops.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-slate-400 font-medium">
                          <i className="fa-solid fa-circle-check text-emerald-500 text-2xl mb-2 block"></i>
                          All storefronts have been verified by Admin.
                        </td>
                      </tr>
                    ) : (
                      pendingShops.map(shop => (
                        <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=200'} 
                                alt={shop.name} 
                                className="w-9 h-9 rounded-xl object-cover border border-slate-100 flex-shrink-0" 
                              />
                              <div>
                                <strong className="text-slate-900 font-bold block">{shop.name}</strong>
                                <span className="text-[10px] text-slate-400 font-medium">{shop.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{shop.market}</td>
                          <td className="p-3 text-slate-600 font-medium">{shop.category || shop.categoryName}</td>
                          <td className="p-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => handleApproveShop(shop.id, shop.name)} 
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                                title="Approve & Verify Storefront"
                              >
                                <i className="fa-solid fa-check text-xs"></i> Verify Store
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Link 
                to="/dashboard/admin/shops" 
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
              >
                View Full Stores Directory <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </div>

          {/* Quick Platform Overview & Stores Status (2/5 width) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between border border-slate-800 lg:col-span-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider">
                <i className="fa-solid fa-shield-halved"></i> Application Owner Status
              </div>
              
              <h3 className="text-lg font-black text-white mb-1">Meena Bazaar Admin Panel</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                You have full administrative authorization over all local storefronts, merchant listings, catalog items, and customer lead inquiries.
              </p>

              <div className="space-y-4 border-t border-slate-800 pt-5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Verified Stores:</span>
                  <span className="font-extrabold text-emerald-400">{verifiedShops.length} Stores</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Pending Verification:</span>
                  <span className="font-extrabold text-amber-400">{pendingShops.length} Stores</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Listed Products:</span>
                  <span className="font-extrabold text-white">{products.length} Products</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Active Market Locations:</span>
                  <span className="font-extrabold text-white">{markets.length} Markets</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/dashboard/admin/shops"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl text-center transition-all shadow-md block"
              >
                Manage All Merchant Shops
              </Link>
              <Link
                to="/dashboard/admin/orders"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center transition-all border border-slate-700 block"
              >
                View Global Lead Orders ({orders.length})
              </Link>
            </div>
          </div>

        </div>

        {/* Global Recent Lead Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Recent Platform Customer Leads</h3>
              <p className="text-xs text-slate-400">Live order inquiries submitted across all local storefronts.</p>
            </div>

            <Link to="/dashboard/admin/orders" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All ({orders.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                    <i className="fa-solid fa-bag-shopping text-xs"></i>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">{order.productName}</strong>
                    <span className="text-[11px] text-slate-500">
                      Store: <span className="font-semibold text-slate-700">{order.shopName}</span> &bull; Customer: {order.customerName} ({order.customerPhone})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900">₹{order.price?.toLocaleString('en-IN')}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
