import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import ProductCard from '../components/ProductCard';

export default function SavedProducts() {
  const { savedProductIds, products, toggleSaveProduct, clearSavedProducts, openWhatsApp } = useBazaar();
  const [searchSavedQuery, setSearchSavedQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  const filteredSaved = savedProducts.filter(p =>
    p.name.toLowerCase().includes(searchSavedQuery.toLowerCase()) ||
    p.shopName.toLowerCase().includes(searchSavedQuery.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchSavedQuery.toLowerCase()))
  );

  return (
    <div className="w-full py-3 md:py-6 flex flex-col gap-4 md:gap-6">

      {/* ── Mobile Header ── */}
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Saved</h1>
          <p className="text-[11px] text-slate-400 font-medium">
            {savedProducts.length > 0 ? `${savedProducts.length} item${savedProducts.length !== 1 ? 's' : ''} bookmarked` : 'Nothing saved yet'}
          </p>
        </div>
        {savedProducts.length > 0 && (
          <button
            onClick={clearSavedProducts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-red-500 font-bold text-[11px] cursor-pointer"
          >
            <i className="fa-solid fa-trash-can text-[10px]"></i> Clear
          </button>
        )}
      </div>

      {/* ── Desktop Header ── */}
      <section className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-lg">
            <i className="fa-solid fa-heart"></i>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Saved Products</h1>
            <p className="text-xs text-slate-500 mt-0.5">Products you have bookmarked to review or order later.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400">{savedProducts.length} Items Saved</span>
          {savedProducts.length > 0 && (
            <button
              onClick={clearSavedProducts}
              className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-500 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-trash-can"></i> Clear All
            </button>
          )}
        </div>
      </section>

      {/* ── Empty State ── */}
      {savedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          {/* Big heart illustration */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
              <i className="fa-regular fa-heart text-red-300 text-4xl"></i>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <i className="fa-solid fa-plus text-emerald-600 text-xs"></i>
            </div>
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1">Nothing saved yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mb-6">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/shops"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-colors"
          >
            Browse Shops &amp; Products
          </Link>
        </div>
      )}

      {/* ── Search + Sort Bar (only when items exist) ── */}
      {savedProducts.length > 0 && (
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
            <input
              type="text"
              placeholder="Search saved items..."
              value={searchSavedQuery}
              onChange={(e) => setSearchSavedQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-2xl text-xs outline-none focus:border-emerald-500 bg-white"
            />
            {searchSavedQuery && (
              <button
                onClick={() => setSearchSavedQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 border-none bg-transparent cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 bg-white outline-none cursor-pointer flex-shrink-0"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
          </select>
        </div>
      )}

      {/* ── Products Grid ── */}
      {savedProducts.length > 0 && (
        <>
          {filteredSaved.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-semibold">
              No saved items match your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredSaved.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Tip banner */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mt-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
              <i className="fa-solid fa-heart text-sm"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Saved items stay in your browser</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Compare products and place WhatsApp orders directly anytime.
              </p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
