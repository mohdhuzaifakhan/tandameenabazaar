import React from 'react';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../../utils/defaultAssets';

export default function ShopHeaderBanner({ shop, onOpenSettings, onAddProduct }) {
  if (!shop) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm transition-all duration-300">
      
      {/* Cover Image Banner with subtle gradient overlay */}
      <div className="h-32 sm:h-44 md:h-52 w-full relative bg-slate-100 overflow-hidden">
        <img
          src={shop.banner || DEFAULT_COVER_BANNER}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-black/20"></div>
      </div>

      {/* Main Header Info Area */}
      <div className="px-5 pb-6 sm:px-8 sm:pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-5 relative z-10 -mt-12 sm:-mt-16 md:-mt-20">
        
        {/* Left Side: Avatar + Shop Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0 flex-1 w-full md:w-auto">
          
          {/* Shop Avatar Logo Container */}
          <div className="relative flex-shrink-0">
            <img
              src={shop.image || DEFAULT_STORE_LOGO}
              alt={shop.name}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
            />
            {shop.verified && (
              <div 
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#056839] text-white border-2 border-white shadow-md flex items-center justify-center text-xs font-black" 
                title="Verified Merchant"
              >
                <i className="fa-solid fa-check"></i>
              </div>
            )}
          </div>

          {/* Shop Metadata */}
          <div className="min-w-0 flex-1 w-full sm:w-auto pt-1 sm:pt-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight break-words">
                {shop.name}
              </h1>
              
              {/* Verified / Pending Status Pill */}
              {shop.verified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200 text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-xs"></i> Verified Store
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-amber-500 text-xs"></i> Pending Verification
                </span>
              )}
            </div>

            {/* Market, Category, Rating Badges */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl text-slate-700 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                <i className="fa-solid fa-location-dot text-[#056839]"></i> {shop.market || 'Main Market'}
              </span>

              <span className="bg-emerald-50/80 border border-emerald-100 px-3 py-1 rounded-xl text-[#056839] text-xs font-extrabold flex items-center gap-1.5">
                <i className="fa-solid fa-tag text-[#056839]"></i> {shop.category || 'General Store'}
              </span>

              {shop.rating && (
                <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-700 text-xs font-black flex items-center gap-1">
                  <i className="fa-solid fa-star text-amber-500 text-xs"></i> {shop.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 w-full md:w-auto mt-2 sm:mt-0 pt-2 md:pt-0 border-t md:border-0 border-slate-100">
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-extrabold text-xs rounded-xl transition-all border border-slate-200/70 flex items-center justify-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <i className="fa-solid fa-sliders text-xs text-slate-600"></i>
            <span>Shop Settings</span>
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 active:scale-95 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10 whitespace-nowrap"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Add Product</span>
          </button>
        </div>

      </div>
    </div>
  );
}
