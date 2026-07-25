import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function Shops() {
  const { shops, categories, markets } = useBazaar();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMarket, setSelectedMarket] = useState(searchParams.get('market') || '');
  const [sortBy, setSortBy] = useState('popular');

  // Synchronize URL parameters with local state
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedMarket(searchParams.get('market') || '');
  }, [searchParams]);

  // Update query params helper
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Filtered and Sorted Shops list
  let filteredShops = shops.filter(shop => {
    const matchesSearch = !searchQuery || 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || shop.category === selectedCategory;
    const matchesMarket = !selectedMarket || shop.market === selectedMarket;

    return matchesSearch && matchesCategory && matchesMarket;
  });

  if (sortBy === 'rating') {
    filteredShops = [...filteredShops].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="w-full flex flex-col gap-8 py-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
          <span className="text-slate-800">Shops</span>
        </div>
        <h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900">Explore Storefronts</h1>
        <p className="text-xs md:text-sm text-slate-500 hidden md:block">Discover top-rated local retailers, boutique brands and merchants in Rampur markets.</p>
      </div>

      {/* Main split grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-6 p-6 rounded-2xl bg-white border border-slate-200 sticky top-24 self-start">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
            {(searchQuery || selectedCategory || selectedMarket) && (
              <button 
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedMarket('');
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Search Name/Area</label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  updateFilters('search', e.target.value);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Categories select */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  updateFilters('category', '');
                }}
                className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-semibold transition-colors ${!selectedCategory ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Categories
              </button>
              {categories.filter(c => c.id !== 'more').map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    updateFilters('category', cat.id);
                  }}
                  className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-semibold transition-colors ${selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Markets select */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Market Area</label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              <button 
                onClick={() => {
                  setSelectedMarket('');
                  updateFilters('market', '');
                }}
                className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-semibold transition-colors ${!selectedMarket ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Areas
              </button>
              {markets.map(mkt => (
                <button 
                  key={mkt}
                  onClick={() => {
                    setSelectedMarket(mkt);
                    updateFilters('market', mkt);
                  }}
                  className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-semibold transition-colors ${selectedMarket === mkt ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {mkt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Bar — search first, then swipeable chip rows */}
        <div className="lg:hidden flex flex-col gap-2.5 pb-2">

          {/* Search bar on top */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search shops, markets..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                updateFilters('search', e.target.value);
              }}
              className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-2xl text-xs bg-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category chips — horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => { setSelectedCategory(''); updateFilters('category', ''); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer transition-all ${
                !selectedCategory ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              All
            </button>
            {categories.filter(c => c.id !== 'more').map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); updateFilters('category', cat.id); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer transition-all ${
                  selectedCategory === cat.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Market area chips — horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => { setSelectedMarket(''); updateFilters('market', ''); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer transition-all ${
                !selectedMarket ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              All Areas
            </button>
            {markets.map(mkt => (
              <button
                key={mkt}
                onClick={() => { setSelectedMarket(mkt); updateFilters('market', mkt); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer transition-all ${
                  selectedMarket === mkt ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {mkt}
              </button>
            ))}
          </div>

        </div>

        {/* Right side: Shop Lists */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-500">{filteredShops.length} Stores Found</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort:</span>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-700 border border-slate-200 rounded-lg p-1 px-2 bg-white outline-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Shops Grid */}
          {filteredShops.length === 0 ? (
            <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center text-3xl"><i className="fa-solid fa-store-slash"></i></div>
              <h3 className="text-base font-bold text-slate-800">No Shops Match Filters</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">We couldn't find any local stores matching your options. Clear some parameters or try searching for something else.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredShops.map(shop => (
                <div 
                  key={shop.id} 
                  className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner header with badge */}
                    <div className="h-32 relative bg-slate-100 overflow-hidden">
                      <img src={shop.bannerImage} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 px-2 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-slate-900 rounded-md">
                        {shop.productsCount || 120}+ Products
                      </span>
                    </div>

                    {/* Logo & Info panel */}
                    <div className="p-5 flex gap-4 -mt-8 relative z-10">
                      {/* Logo avatar */}
                      <div className="w-16 h-16 rounded-xl bg-white p-1 flex-shrink-0">
                        <img src={shop.logoImage} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-6">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{shop.name}</h4>
                          {shop.verified && <i className="fa-solid fa-circle-check text-emerald-600 text-[11px]" title="Verified Seller"></i>}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">{shop.categoryName || 'Retailer'}</span>
                      </div>
                    </div>

                    {/* Shop Description */}
                    <div className="px-5 pb-3">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{shop.description || 'Verified local shop operating in the heart of Rampur city markets.'}</p>
                    </div>

                    {/* Rating Strip */}
                    <div className="px-5 pb-5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                      <span className="flex items-center gap-1"><i className="fa-solid fa-star text-amber-500"></i> <strong className="text-slate-800 font-bold">{shop.rating}</strong> ({shop.reviewsCount} reviews)</span>
                      <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-slate-400"></i> {shop.market}</span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-slate-50/50 flex gap-2">
                    <Link 
                      to={`/shop/${shop.id}`}
                      className="flex-1 py-2 text-center bg-white border border-slate-200 hover:border-slate-350 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                    >
                      Visit Shop
                    </Link>
                    <a 
                      href={`https://wa.me/${shop.whatsapp || '919876543210'}?text=Hello ${shop.name}, I found your shop on Digital Meena Bazaar.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-600 rounded-lg flex items-center justify-center text-sm transition-colors"
                      title="Contact on WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
