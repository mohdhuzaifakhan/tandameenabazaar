import React from 'react';

export default function ShopOverviewTab({
  stats = [],
  shopProducts = [],
  onViewAllProducts,
  onAddFirstProduct,
  shop,
  onEditProfile
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${s.color}`}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold px-2 py-0.5">{s.trend}</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">{s.value}</h3>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Products List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Products</h3>
            <button onClick={onViewAllProducts} className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">
              View All ({shopProducts.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {shopProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                <p className="text-xs mb-3">No products added to this Shop yet.</p>
                <button onClick={onAddFirstProduct} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                  Add First Product
                </button>
              </div>
            ) : (
              shopProducts.slice(0, 5).map(product => (
                <div key={product.id} className="py-3.5 bg-white rounded-2xl px-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                      <p className="text-[11px] text-slate-400">{product.categoryName || 'General'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">₹{product.price?.toLocaleString('en-IN')}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {product.stockStatus || 'In Stock'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shop Summary Card */}
        {shop && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200/80 text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-2xs">
                  <i className="fa-solid fa-store text-xs"></i> Storefront Status
                </span>
                {shop.verified ? (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Active &amp; Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    Review Pending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-slate-900 mt-4">{shop.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium line-clamp-2">
                {shop.description || 'No store description provided yet.'}
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <i className="fa-solid fa-phone text-emerald-600 text-xs"></i>
                    <span>Phone</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{shop.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2 text-[#056839] text-xs font-semibold">
                    <i className="fa-brands fa-whatsapp text-[#25D366] text-sm"></i>
                    <span>WhatsApp Lead</span>
                  </div>
                  <span className="text-xs font-black text-[#056839]">{shop.whatsapp || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <i className="fa-solid fa-clock text-amber-500 text-xs"></i>
                    <span>Shop Hours</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{shop.timing || '10:00 AM - 9:00 PM'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onEditProfile}
              className="w-full mt-6 py-3 bg-[#056839] hover:bg-emerald-800 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-pen-to-square"></i> Edit Shop Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
