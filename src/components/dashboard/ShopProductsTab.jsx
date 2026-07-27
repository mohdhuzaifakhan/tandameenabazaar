import React from 'react';

export default function ShopProductsTab({
  productSearch,
  setProductSearch,
  stockFilter,
  setStockFilter,
  filteredProducts = [],
  onAddProduct,
  onToggleStock,
  onEditProduct,
  onDeleteProduct
}) {
  return (
    <div className="space-y-6">

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 font-medium cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={onAddProduct}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      {/* Products Container (Responsive Mobile Cards + Desktop Table) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Mobile View: Clean Product Cards (sm:hidden) */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
              <p className="text-xs mb-3">No products match your search or filter.</p>
              <button onClick={onAddProduct} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                Add New Product
              </button>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div key={p.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{p.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{p.categoryName || p.category}</span>
                      <div className="mt-1">
                        <span className="font-black text-xs text-slate-900">₹{p.price?.toLocaleString('en-IN')}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStock(p)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${p.stockStatus === 'Out of Stock'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                  >
                    {p.stockStatus || 'In Stock'}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-pen text-xs"></i> Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 whitespace-nowrap">Product Details</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Price</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Stock Status</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                    <p className="text-xs mb-3">No products match your search or filter.</p>
                    <button onClick={onAddProduct} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                      Add New Product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.brand || 'Merchant Product'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {p.categoryName || p.category}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      ₹{p.price?.toLocaleString('en-IN')}
                      {p.originalPrice > p.price && (
                        <span className="text-[10px] text-slate-400 line-through block font-normal">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStock(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${p.stockStatus === 'Out of Stock'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                      >
                        {p.stockStatus || 'In Stock'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Edit Product"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p)}
                        className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Delete Product"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
