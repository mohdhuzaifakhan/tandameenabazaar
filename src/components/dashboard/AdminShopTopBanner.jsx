import React from 'react';

export default function AdminShopTopBanner({ shopName, onClear }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/15 border border-amber-300/80 p-3.5 sm:p-4 shadow-sm backdrop-blur-md transition-all animate-fade-in">
      {/* Decorative left border accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-2xl"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-inner">
            <i className="fa-solid fa-eye text-xs sm:text-sm animate-pulse"></i>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                Admin Mode
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                Inspecting Shop as Admin:
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900 truncate mt-0.5">
              {shopName || 'Selected Shop'}
            </h4>
          </div>
        </div>

        {/* Right Side: Clear Action Button */}
        <button
          type="button"
          onClick={onClear}
          className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <i className="fa-solid fa-rotate-left text-xs"></i>
          <span>Clear Shop Selection</span>
        </button>
      </div>
    </div>
  );
}

