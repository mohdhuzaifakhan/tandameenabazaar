import React from 'react';

export default function ShopNavTabs({ activeTab, setActiveTab, catalogCount = 0 }) {
  return (
    <div className="sticky top-16 z-30 py-2.5 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all duration-300">
      <div className="w-full flex items-center gap-2 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'overview'
            ? 'bg-[#056839] text-white shadow-md shadow-emerald-950/20'
            : 'text-slate-600 hover:bg-slate-200/70 bg-white border border-slate-200/80 font-bold'
            }`}
        >
          <i className="fa-solid fa-chart-pie text-xs"></i>
          <span className="whitespace-nowrap">Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'products'
            ? 'bg-[#056839] text-white shadow-md shadow-emerald-950/20'
            : 'text-slate-600 hover:bg-slate-200/70 bg-white border border-slate-200/80 font-bold'
            }`}
        >
          <i className="fa-solid fa-boxes-stacked text-xs"></i>
          <span className="whitespace-nowrap">Catalog ({catalogCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qrcode')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'qrcode'
            ? 'bg-[#056839] text-white shadow-md shadow-emerald-950/20'
            : 'text-slate-600 hover:bg-slate-200/70 bg-white border border-slate-200/80 font-bold'
            }`}
        >
          <i className="fa-solid fa-qrcode text-xs"></i>
          <span className="whitespace-nowrap">Shop QR Code</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'store'
            ? 'bg-[#056839] text-white shadow-md shadow-emerald-950/20'
            : 'text-slate-600 hover:bg-slate-200/70 bg-white border border-slate-200/80 font-bold'
            }`}
        >
          <i className="fa-solid fa-store text-xs"></i>
          <span className="whitespace-nowrap">Edit Shop Profile</span>
        </button>
      </div>
    </div>
  );
}
