import React from 'react';

export default function ShopsFilterModal({
  isOpen,
  onClose,
  categories = [],
  markets = [],
  selectedCategory,
  setSelectedCategory,
  selectedMarket,
  setSelectedMarket,
  sortBy,
  setSortBy,
  onReset,
  filteredCount = 0,
  updateFilters
}) {
  if (!isOpen) return null;

  const activeCount = (selectedCategory ? 1 : 0) + (selectedMarket ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh] border border-slate-100 overflow-hidden">
        
        {/* Mobile Top Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden mt-2.5 mb-0.5 flex-shrink-0"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center text-sm font-black flex-shrink-0">
              <i className="fa-solid fa-sliders"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">Filter Storefronts</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Refine shops by category, market &amp; ratings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] sm:text-xs font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-center transition-colors text-sm"
              title="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0">

          {/* Category Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-shapes text-[#056839]"></i> 1. Category
              </span>
              {selectedCategory && (
                <span className="text-[11px] text-[#056839] font-extrabold">
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  updateFilters('category', '');
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 min-w-0 ${
                  !selectedCategory
                    ? 'bg-emerald-50 border-[#056839] ring-2 ring-[#056839]/20 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <i className={`fa-solid fa-grid-2 text-xs flex-shrink-0 ${!selectedCategory ? 'text-[#056839]' : 'text-slate-400'}`}></i>
                  <span className={`text-xs font-extrabold truncate ${!selectedCategory ? 'text-[#056839]' : 'text-slate-700'}`}>
                    All Categories
                  </span>
                </div>
                {!selectedCategory && (
                  <i className="fa-solid fa-circle-check text-[#056839] text-xs flex-shrink-0"></i>
                )}
              </button>

              {categories.filter(c => c.id !== 'more').map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      updateFilters('category', cat.id);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 min-w-0 ${
                      isSelected
                        ? 'bg-emerald-50 border-[#056839] ring-2 ring-[#056839]/20 shadow-2xs'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <i className={`fa-solid ${cat.icon || 'fa-tag'} text-xs flex-shrink-0 ${isSelected ? 'text-[#056839]' : 'text-slate-400'}`}></i>
                      <span className={`text-xs font-extrabold truncate ${isSelected ? 'text-[#056839]' : 'text-slate-700'}`}>
                        {cat.name}
                      </span>
                    </div>
                    {isSelected && (
                      <i className="fa-solid fa-circle-check text-[#056839] text-xs flex-shrink-0"></i>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Market Selection Grid */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-amber-500"></i> 2. Market Location
              </span>
              {selectedMarket && (
                <span className="text-[11px] text-amber-700 font-extrabold">
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedMarket('');
                  updateFilters('market', '');
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 min-w-0 ${
                  !selectedMarket
                    ? 'bg-amber-50 border-amber-400/80 ring-2 ring-amber-400/20 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <i className={`fa-solid fa-city text-xs flex-shrink-0 ${!selectedMarket ? 'text-amber-600' : 'text-slate-400'}`}></i>
                  <span className={`text-xs font-extrabold truncate ${!selectedMarket ? 'text-amber-950' : 'text-slate-700'}`}>
                    All Markets
                  </span>
                </div>
                {!selectedMarket && (
                  <i className="fa-solid fa-circle-check text-amber-600 text-xs flex-shrink-0"></i>
                )}
              </button>

              {markets.map((mkt, idx) => {
                const name = typeof mkt === 'object' ? (mkt.name || mkt.id) : mkt;
                const id = typeof mkt === 'object' ? (mkt.id || name || idx) : mkt;
                const isSelected = selectedMarket === name;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setSelectedMarket(name);
                      updateFilters('market', name);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 min-w-0 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400/80 ring-2 ring-amber-400/20 shadow-2xs'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <i className={`fa-solid fa-location-dot text-xs flex-shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`}></i>
                      <span className={`text-xs font-extrabold truncate ${isSelected ? 'text-amber-950' : 'text-slate-700'}`}>
                        {name}
                      </span>
                    </div>
                    {isSelected && (
                      <i className="fa-solid fa-circle-check text-amber-600 text-xs flex-shrink-0"></i>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Order Options */}
          <div className="space-y-3 pt-2 border-t border-slate-100 pb-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-arrow-down-short-wide text-blue-600"></i> 3. Sort Order
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSortBy('popular')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer text-xs font-extrabold flex items-center justify-center gap-2 ${
                  sortBy === 'popular'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-200/40 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <i className="fa-solid fa-fire text-amber-500"></i>
                <span>Most Popular</span>
              </button>

              <button
                type="button"
                onClick={() => setSortBy('rating')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer text-xs font-extrabold flex items-center justify-center gap-2 ${
                  sortBy === 'rating'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-200/40 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <i className="fa-solid fa-star text-amber-400"></i>
                <span>Top Rated</span>
              </button>
            </div>
          </div>

        </div>

        {/* Guaranteed Visible Mobile Footer Action above Bottom Navigation Bar */}
        <div className="p-4 pb-20 sm:pb-5 bg-white border-t border-slate-100 flex-shrink-0 shadow-lg z-20">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#056839] hover:bg-emerald-800 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-check text-xs"></i>
            <span>Apply Filters ({filteredCount} Shops)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
