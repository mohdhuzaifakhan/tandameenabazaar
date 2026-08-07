import React from 'react';

export default function ShopOverviewTab({
  stats = [],
  shopProducts = [],
  onViewAllProducts,
  onAddFirstProduct,
  shop,
  onEditProfile,
  onViewQRCode
}) {
  // Compute top viewed products for this specific merchant shop
  const topViewedInShop = [...shopProducts]
    .filter(p => (p.viewCount || 0) > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  const maxViews = topViewedInShop[0]?.viewCount || 1;

  return (
    <div className="space-y-6">
      {/* Stats Grid - 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.color}`}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <span className="text-[11px] text-slate-400 font-extrabold truncate text-right">{s.trend}</span>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{s.value}</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Products & Top Viewed + Store Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Recent Products & Top Viewed Products */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Catalog Items */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Products</h3>
                <p className="text-xs text-slate-400 font-medium">Latest items added to your storefront</p>
              </div>
              <button 
                onClick={onViewAllProducts} 
                className="text-xs text-[#056839] font-black hover:underline cursor-pointer flex items-center gap-1"
              >
                View All ({shopProducts.length}) <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {shopProducts.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <i className="fa-solid fa-box-open text-3xl text-slate-300 block"></i>
                  <p className="text-xs font-bold text-slate-600">No products added to this store yet.</p>
                  <button 
                    onClick={onAddFirstProduct} 
                    className="px-4 py-2 bg-[#056839] hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-sm cursor-pointer transition-colors"
                  >
                    + Add Your First Product
                  </button>
                </div>
              ) : (
                shopProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-1 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100')}
                        alt={product.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10.5px] text-slate-400 font-semibold truncate">{product.categoryName || 'General'}</span>
                          {(product.viewCount || 0) > 0 && (
                            <span className="text-[10px] font-extrabold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                              <i className="fa-solid fa-eye text-[9px]"></i> {(product.viewCount || 0).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block">₹{product.price?.toLocaleString('en-IN')}</span>
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase ${
                        product.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stockStatus || 'In Stock'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Viewed Products Analytics Block */}
          {topViewedInShop.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-black">
                    <i className="fa-solid fa-fire"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Most Viewed Catalog Products</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Ranked by total customer page views</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100">POPULAR</span>
              </div>

              <div className="space-y-3">
                {topViewedInShop.map((prod, idx) => {
                  const pct = Math.round(((prod.viewCount || 0) / maxViews) * 100);
                  const imgSrc = prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100';
                  return (
                    <div key={prod.id} className="flex items-center gap-3">
                      <span className={`text-[11px] font-black w-5 text-center shrink-0 ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-400' : 'text-slate-300'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <img
                        src={imgSrc}
                        alt={prod.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate leading-none">{prod.name}</p>
                        <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-lg shrink-0 tabular-nums">
                        {(prod.viewCount || 0).toLocaleString('en-IN')} views
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Store Profile Summary */}
        {shop && (
          <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-all h-fit space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200/80 text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-2xs">
                  <i className="fa-solid fa-store text-xs"></i> Storefront Status
                </span>
                {shop.verified ? (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    Active &amp; Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-100">
                    Review Pending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-slate-900 mt-4 tracking-tight">{shop.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium line-clamp-2">
                {shop.description || 'No store description provided yet.'}
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <i className="fa-solid fa-phone text-emerald-600 text-xs"></i>
                    <span>Phone Contact</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{shop.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2 text-[#056839] text-xs font-semibold">
                    <i className="fa-brands fa-whatsapp text-[#25D366] text-sm"></i>
                    <span>WhatsApp Connect</span>
                  </div>
                  <span className="text-xs font-black text-[#056839]">{shop.whatsapp || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <i className="fa-solid fa-clock text-amber-500 text-xs"></i>
                    <span>Business Hours</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{shop.timing || '10:00 AM - 9:00 PM'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                  <div className="flex items-center gap-2 text-violet-700 text-xs font-semibold">
                    <i className="fa-solid fa-eye text-violet-500 text-xs"></i>
                    <span>Total Store Visits</span>
                  </div>
                  <span className="text-xs font-black text-violet-700">{(shop.viewCount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {onViewQRCode && (
                <button
                  type="button"
                  onClick={onViewQRCode}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-[#056839] border border-emerald-200 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-qrcode text-xs"></i> Get Store QR Code
                </button>
              )}

              <button
                type="button"
                onClick={onEditProfile}
                className="w-full py-3 bg-[#056839] hover:bg-emerald-800 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-pen-to-square"></i> Edit Shop Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
