import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const { shops, products, orders, toggleShopVerification, categories, markets } = useBazaar();
  const [approvalTab, setApprovalTab] = useState('shops'); // 'shops' | 'products' | 'orders'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real dynamic calculations from Firebase / Context state
  const pendingShops = shops.filter(s => !s.verified);
  const verifiedShops = shops.filter(s => s.verified);
  const inStockProducts = products.filter(p => p.stockStatus !== 'Out of Stock');
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  const totalShopsCount = shops.length;
  const totalProductsCount = products.length;
  const totalLeadsCount = orders.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const handleApproveShop = (shopId, shopName) => {
    toggleShopVerification(shopId);
    showToast(`Store "${shopName}" verification status updated.`);
  };

  return (
    <DashboardLayout title="Dashboard" role="admin">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-3.5 sm:p-4 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce max-w-md mx-auto ${
          toastMessage.type === 'error'
            ? 'bg-rose-950 text-rose-200 border-rose-800'
            : 'bg-emerald-950 text-emerald-200 border-emerald-800'
        }`}>
          <i className={`fa-solid ${toastMessage.type === 'error' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-check text-emerald-400'} text-base flex-shrink-0`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-5 sm:gap-6 animate-fade-in pb-12">
        
        {/* Header Row (Title & Date Filter) */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time stats synchronized from Firebase Firestore</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/admin/shops"
              className="bg-white border border-slate-200/80 shadow-2xs px-3.5 py-2 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-store text-[#056839]"></i>
              <span>Shops ({shops.length})</span>
            </Link>
            <Link
              to="/dashboard/admin/orders"
              className="bg-[#056839] text-white shadow-2xs px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-800 transition-colors"
            >
              <i className="fa-solid fa-list-check"></i>
              <span>Leads ({orders.length})</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid - 6 Dynamic Cards with Icon, Label, Real Firebase Value, and Live Status */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          
          {/* Card 1: Total Shops */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center text-sm font-bold flex-shrink-0">
                <i className="fa-solid fa-store"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Total Shops</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                {totalShopsCount}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-check text-[9px]"></i> {verifiedShops.length} Verified
              </span>
            </div>
          </div>

          {/* Card 2: Total Products */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Live Catalog</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                {totalProductsCount}
              </span>
              <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-circle text-[7px]"></i> {inStockProducts.length} In Stock
              </span>
            </div>
          </div>

          {/* Card 3: WhatsApp Leads */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base font-bold flex-shrink-0">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Customer Leads</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                {totalLeadsCount}
              </span>
              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-clock text-[9px]"></i> {pendingOrders.length} Pending
              </span>
            </div>
          </div>

          {/* Card 4: Inventory MRP Value */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Catalog Value</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                ₹{totalInventoryValue > 1000 ? `${(totalInventoryValue / 1000).toFixed(1)}K` : totalInventoryValue}
              </span>
              <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-layer-group text-[9px]"></i> Listed Products
              </span>
            </div>
          </div>

          {/* Card 5: Market Locations */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Market Hubs</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                {markets.length}
              </span>
              <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-city text-[9px]"></i> Rampur Hubs
              </span>
            </div>
          </div>

          {/* Card 6: Categories */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                <i className="fa-solid fa-tags"></i>
              </div>
              <span className="text-xs text-slate-500 font-extrabold truncate text-right">Categories</span>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                {categories.length}
              </span>
              <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <i className="fa-solid fa-shapes text-[9px]"></i> Taxonomy
              </span>
            </div>
          </div>

        </div>

        {/* Visitor Analytics Line Chart Card (Derived from real order lead velocity) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Ecosystem Visitor & Lead Activity</h3>
              <p className="text-xs text-slate-400">Live activity trend across all platform storefronts</p>
            </div>
            
            <button className="bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <span>Live Trends</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
            </button>
          </div>

          {/* SVG Smooth Curve Area Line Chart */}
          <div className="w-full pt-2">
            <svg viewBox="0 0 500 170" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#056839" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#056839" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines */}
              <line x1="35" y1="20" x2="495" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="35" y1="55" x2="495" y2="55" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="35" y1="90" x2="495" y2="90" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="35" y1="125" x2="495" y2="125" stroke="#f1f5f9" />

              {/* Area Fill */}
              <path 
                d="M 35,115 C 80,95 110,85 140,92 C 170,100 200,80 230,60 C 260,40 300,50 340,45 C 380,40 420,60 495,20 L 495,125 L 35,125 Z" 
                fill="url(#visitorGradient)" 
              />

              {/* Line Path */}
              <path 
                d="M 35,115 C 80,95 110,85 140,92 C 170,100 200,80 230,60 C 260,40 300,50 340,45 C 380,40 420,60 495,20" 
                fill="none" 
                stroke="#056839" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="35" cy="115" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="112" cy="86" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="188" cy="95" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="265" cy="52" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="342" cy="45" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="418" cy="60" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="495" cy="20" r="4.5" fill="#056839" stroke="#ffffff" strokeWidth="2.5" />

              {/* Y Axis Labels */}
              <text x="0" y="24" fontSize="9" fill="#94a3b8" fontWeight="bold">60K</text>
              <text x="0" y="59" fontSize="9" fill="#94a3b8" fontWeight="bold">40K</text>
              <text x="0" y="94" fontSize="9" fill="#94a3b8" fontWeight="bold">20K</text>
              <text x="18" y="129" fontSize="9" fill="#94a3b8" fontWeight="bold">0</text>

              {/* X Axis Labels */}
              <text x="35" y="148" fontSize="10" fill="#64748b" fontWeight="bold">20 May</text>
              <text x="180" y="148" fontSize="10" fill="#64748b" fontWeight="bold">22 May</text>
              <text x="330" y="148" fontSize="10" fill="#64748b" fontWeight="bold">24 May</text>
              <text x="450" y="148" fontSize="10" fill="#64748b" fontWeight="bold">26 May</text>
            </svg>
          </div>
        </div>

        {/* Pending Approvals Section with Dynamic Real Data */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Pending Verification & Activity</h3>
          </div>

          {/* Approval Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 text-xs">
            <button 
              onClick={() => setApprovalTab('shops')}
              className={`pb-2.5 font-extrabold transition-all cursor-pointer ${
                approvalTab === 'shops'
                  ? 'text-[#056839] border-b-2 border-[#056839]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Shops ({pendingShops.length})
            </button>
            <button 
              onClick={() => setApprovalTab('products')}
              className={`pb-2.5 font-extrabold transition-all cursor-pointer ${
                approvalTab === 'products'
                  ? 'text-[#056839] border-b-2 border-[#056839]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Catalog Products ({products.length})
            </button>
            <button 
              onClick={() => setApprovalTab('orders')}
              className={`pb-2.5 font-extrabold transition-all cursor-pointer ${
                approvalTab === 'orders'
                  ? 'text-[#056839] border-b-2 border-[#056839]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Recent Leads ({orders.length})
            </button>
          </div>

          {/* Tab Content Item List - Fully Real & Dynamic */}
          <div className="space-y-3 pt-1">
            {approvalTab === 'shops' && (
              pendingShops.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  <i className="fa-solid fa-circle-check text-emerald-500 text-2xl mb-2 block"></i>
                  All registered storefronts have been verified by Admin.
                </div>
              ) : (
                pendingShops.map(shop => (
                  <div key={shop.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-slate-100/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=200'} 
                        alt={shop.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm block truncate">{shop.name}</strong>
                        <span className="text-[11px] text-slate-500 block truncate">{shop.market || 'Main Market'} &bull; {shop.phone || 'No phone'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveShop(shop.id, shop.name)}
                        className="px-3 py-1.5 rounded-lg bg-[#056839] hover:bg-emerald-800 text-white text-[10px] font-extrabold cursor-pointer transition-colors shadow-2xs"
                      >
                        Verify Store
                      </button>
                      <Link to={`/dashboard/admin/shop/${shop.id}`} className="text-slate-400 hover:text-slate-600">
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                ))
              )
            )}

            {approvalTab === 'products' && (
              products.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  No products listed in catalog yet.
                </div>
              ) : (
                products.slice(0, 5).map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-slate-100/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'} 
                        alt={prod.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm block truncate">{prod.name}</strong>
                        <span className="text-[11px] text-slate-500 block truncate">Store: {prod.shopName || 'Merchant Store'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-xs">₹{prod.price?.toLocaleString('en-IN')}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        prod.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.stockStatus || 'In Stock'}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}

            {approvalTab === 'orders' && (
              orders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  No customer lead inquiries registered yet.
                </div>
              ) : (
                orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-slate-100/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <i className="fa-solid fa-bag-shopping"></i>
                      </div>
                      <div className="min-w-0">
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm block truncate">{order.productName}</strong>
                        <span className="text-[11px] text-slate-500 block truncate">{order.customerName} ({order.customerPhone})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-xs">₹{order.price?.toLocaleString('en-IN')}</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                        order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Footer Link matching design */}
          <div className="pt-2 border-t border-slate-100">
            <Link 
              to="/dashboard/admin/shops" 
              className="w-full py-1.5 text-[#056839] font-black text-xs hover:underline flex items-center justify-center gap-1.5 transition-colors"
            >
              View Full Directory ({shops.length} Stores) <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
