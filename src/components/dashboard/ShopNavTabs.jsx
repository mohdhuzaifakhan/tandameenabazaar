import React from 'react';

export default function ShopNavTabs({ activeTab, setActiveTab, catalogCount = 0 }) {
  return (
    <div className="w-full flex items-center gap-2 border-b border-slate-200 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        type="button"
        onClick={() => setActiveTab('overview')}
        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'overview'
          ? 'bg-emerald-950 text-white font-black shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200/60'
          }`}
      >
        <i className="fa-solid fa-chart-pie text-xs"></i>
        <span className="whitespace-nowrap">Overview</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('products')}
        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'products'
          ? 'bg-emerald-950 text-white font-black shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200/60'
          }`}
      >
        <i className="fa-solid fa-boxes-stacked text-xs"></i>
        <span className="whitespace-nowrap">Catalog ({catalogCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('store')}
        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'store'
          ? 'bg-emerald-950 text-white font-black shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200/60'
          }`}
      >
        <i className="fa-solid fa-store text-xs"></i>
        <span className="whitespace-nowrap">Edit Shop Profile</span>
      </button>
    </div>
  );
}
