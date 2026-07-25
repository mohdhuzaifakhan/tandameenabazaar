import React, { useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  const { shops, products, toggleShopVerification } = useBazaar();
  const [approvalTab, setApprovalTab] = useState('shops'); // 'shops', 'products', 'banners'

  // Filter pending approvals
  const pendingShops = shops.filter(s => !s.verified);

  return (
    <DashboardLayout title="Admin Overview" role="admin">
      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Real-time statistics and platform action center</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <i className="fa-regular fa-calendar text-slate-400"></i>
              <span>Today: 25 July 2026</span>
              <i className="fa-solid fa-chevron-down text-[8px] text-slate-400"></i>
            </div>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors">
              <i className="fa-solid fa-file-export mr-1"></i> Export
            </button>
          </div>
        </div>

        {/* Stats Grid - 6 responsive cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Shops */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-store"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Total Shops</span>
              <span className="text-base font-black text-slate-900 mt-1 block">412</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +18</span>
            </div>
          </div>

          {/* Card 2: Products */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-box"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Products</span>
              <span className="text-base font-black text-slate-900 mt-1 block">12,568</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +24</span>
            </div>
          </div>

          {/* Card 3: Users */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Total Users</span>
              <span className="text-base font-black text-slate-900 mt-1 block">8,945</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +16</span>
            </div>
          </div>

          {/* Card 4: Visitors */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Visitors</span>
              <span className="text-base font-black text-slate-900 mt-1 block">45,670</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +21%</span>
            </div>
          </div>

          {/* Card 5: Leads */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">WhatsApp Clicks</span>
              <span className="text-base font-black text-slate-900 mt-1 block">356</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +14</span>
            </div>
          </div>

          {/* Card 6: Active Orders */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-base flex-shrink-0">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Active Orders</span>
              <span className="text-base font-black text-slate-900 mt-1 block">1,256</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block flex items-center gap-0.5"><i className="fa-solid fa-arrow-up"></i> +20%</span>
            </div>
          </div>

        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Visitor Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Visitor Analytics</h3>
              <select className="border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-slate-600 cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-44 relative">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="170" x2="480" y2="170" stroke="#f1f5f9" strokeWidth="1.5" />
                <text x="5" y="25" fill="#94a3b8" fontSize="8" fontWeight="bold">50K</text>
                <text x="5" y="75" fill="#94a3b8" fontSize="8" fontWeight="bold">30K</text>
                <text x="5" y="175" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>
                
                <path 
                  d="M 30,150 Q 80,100 130,120 T 230,90 T 330,120 T 430,80 L 480,40" 
                  fill="none" 
                  stroke="#056839" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
                
                <circle cx="30" cy="150" r="4.5" fill="#056839" />
                <circle cx="130" cy="120" r="4.5" fill="#056839" />
                <circle cx="230" cy="90" r="4.5" fill="#056839" />
                <circle cx="330" cy="120" r="4.5" fill="#056839" />
                <circle cx="430" cy="80" r="4.5" fill="#056839" />
                <circle cx="480" cy="40" r="4.5" fill="#056839" />
              </svg>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Top Categories</h3>
                <a href="#categories" onClick={e => e.preventDefault()} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">View All</a>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Mobile &amp; Accessories</span>
                    <span>18.7%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18.7%' }} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Fashion Boutique</span>
                    <span>15.1%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-650 rounded-full" style={{ width: '15.1%' }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Consumer Electronics</span>
                    <span>12.3%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '12.3%' }} />
                  </div>
                </div>
              </div>
            </div>
            
            <span className="text-[10px] text-slate-400 font-semibold mt-4">Calculated across 12,568 products</span>
          </div>

          {/* Recent Shop Registrations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Recent Shops</h3>
              <a href="#shops" onClick={e => e.preventDefault()} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">View All</a>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Gupta General Store</h4>
                  <span className="text-[10px] text-slate-450 font-semibold">Civil Lines, Rampur</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">2h ago</span>
              </div>
              
              <div className="flex justify-between items-start border-t border-slate-50 pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Khan Footwear</h4>
                  <span className="text-[10px] text-slate-450 font-semibold">Nai Sadak, Rampur</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">4h ago</span>
              </div>

              <div className="flex justify-between items-start border-t border-slate-50 pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Fashion Hub</h4>
                  <span className="text-[10px] text-slate-450 font-semibold">Mandi Samiti, Rampur</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">6h ago</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pending Approvals & Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Pending Approvals Card (3/5 Width) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Pending Approvals</h3>
              
              {/* Tabs Select */}
              <div className="flex border-b border-slate-100 mb-4 gap-6">
                <button 
                  onClick={() => setApprovalTab('shops')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${approvalTab === 'shops' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
                >
                  Shops ({pendingShops.length})
                </button>
                <button 
                  onClick={() => setApprovalTab('products')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${approvalTab === 'products' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
                >
                  Products (15)
                </button>
                <button 
                  onClick={() => setApprovalTab('banners')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${approvalTab === 'banners' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
                >
                  Banners (3)
                </button>
              </div>

              {/* Data Table */}
              {approvalTab === 'shops' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="p-3">Shop Info</th>
                        <th className="p-3">Market</th>
                        <th className="p-3">Applied</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingShops.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">No pending shop verifications.</td>
                        </tr>
                      ) : (
                        pendingShops.map(shop => (
                          <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="p-3 flex items-center gap-3">
                              <img src={shop.logoImage} alt={shop.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                              <div>
                                <strong className="text-slate-800 font-bold block">{shop.name}</strong>
                                <span className="text-[10px] text-slate-400">Owner: Rohit Kumar</span>
                              </div>
                            </td>
                            <td className="p-3 text-slate-500 font-semibold">{shop.market}</td>
                            <td className="p-3 text-slate-400 font-medium">26 May 2024</td>
                            <td className="p-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <button 
                                  onClick={() => toggleShopVerification(shop.id)} 
                                  className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-650 flex items-center justify-center cursor-pointer transition-colors border border-emerald-100"
                                  title="Approve Shop"
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                                <button 
                                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center cursor-pointer transition-colors border border-red-100"
                                  title="Reject"
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {approvalTab === 'products' && (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  Pending product list is up to date.
                </div>
              )}

              {approvalTab === 'banners' && (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  Pending promotion banners are up to date.
                </div>
              )}
            </div>

            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 flex items-center gap-1.5">
              View All Approvals <i className="fa-solid fa-arrow-right text-[9px]"></i>
            </button>
          </div>

          {/* Platform Overview (2/5 Width) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-5">Platform Overview</h3>
              <div className="flex flex-col items-center gap-6 justify-center">
                
                {/* SVG Doughnut */}
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f8fafc" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#056839" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="50.2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7c3aed" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="130.6" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0284c7" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ea580c" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="213.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[8px] text-slate-400 font-bold uppercase leading-none">Products</span>
                    <strong className="text-xs font-black text-slate-800 mt-1">12,568</strong>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex flex-col gap-2 w-full text-[10px] text-slate-500 font-semibold border-t border-slate-50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />Mobile &amp; Accessories</span>
                    <strong>18.7%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-650" />Fashion Boutique</span>
                    <strong>15.1%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600" />Consumer Electronics</span>
                    <strong>12.3%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" />Home &amp; Kitchen</span>
                    <strong>9.8%</strong>
                  </div>
                </div>

              </div>
            </div>

            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 flex items-center justify-center gap-1.5 w-full text-center">
              View Detailed Metrics <i className="fa-solid fa-arrow-right text-[9px]"></i>
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
