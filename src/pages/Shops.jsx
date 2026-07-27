import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ShopsFilterModal from '../components/ShopsFilterModal';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function Shops() {
  const { shops, categories, markets } = useBazaar();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search input and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMarket, setSelectedMarket] = useState(searchParams.get('market') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMarket('');
  };

  // Filtered and Sorted Shops list - Only verified shops are published to public users
  let filteredShops = shops.filter(shop => {
    if (!shop.verified) return false;

    const matchesSearch = !searchQuery ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.market && shop.market.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shop.address && shop.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      shop.category === selectedCategory ||
      (shop.category && shop.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (shop.categoryName && shop.categoryName.toLowerCase() === selectedCategory.toLowerCase()) ||
      (categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === (shop.category || '').toLowerCase()) ||
      (categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === (shop.categoryName || '').toLowerCase());

    const matchesMarket = !selectedMarket || shop.market === selectedMarket;

    return matchesSearch && matchesCategory && matchesMarket;
  });

  if (sortBy === 'rating') {
    filteredShops = [...filteredShops].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const isFiltered = Boolean(searchQuery || selectedCategory || selectedMarket);
  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedMarket ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-6 py-4 animate-fade-in pb-16">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px]"></i>
            <span className="text-slate-800">Shops</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Explore Shops
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200 text-xs font-extrabold">
              {filteredShops.length} Verified
            </span>
          </div>
        </div>

        {/* Search Bar & Filter Modal Trigger Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* <div className="relative flex-1 sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search shops or areas..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                updateFilters('search', e.target.value);
              }}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-emerald-500 font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  updateFilters('search', '');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div> */}

          {/* Filter Modal Launch Button */}
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className={`px-3.5 py-2 text-xs font-extrabold rounded-xl border flex items-center gap-2 transition-all cursor-pointer shadow-2xs whitespace-nowrap ${activeFilterCount > 0
              ? 'bg-[#056839] text-white border-[#056839]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <i className="fa-solid fa-sliders text-xs"></i>
            <span>All Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#056839] text-[10px] flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl bg-white outline-none cursor-pointer shadow-2xs flex-shrink-0"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Styled Filter Panel: Quick Scrollable Pills */}
      {/* <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-4"> */}

      {/* Category Filters */}
      {/* <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <i className="fa-solid fa-shapes text-[#056839]"></i> Category
            </span>
            <button
              onClick={() => setShowFilterModal(true)}
              className="text-[11px] text-[#056839] font-extrabold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All ({categories.length - 1})</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2">
            <button
              onClick={() => { setSelectedCategory(''); updateFilters('category', ''); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border cursor-pointer transition-all flex items-center gap-1.5 ${!selectedCategory
                ? 'bg-[#056839] border-[#056839] text-white shadow-xs'
                : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
            >
              <i className="fa-solid fa-grid-2 text-[10px]"></i>
              <span>All Categories</span>
            </button>

            {categories.filter(c => c.id !== 'more').map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); updateFilters('category', cat.id); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border cursor-pointer transition-all flex items-center gap-1.5 ${selectedCategory === cat.id
                  ? 'bg-[#056839] border-[#056839] text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                <i className={`fa-solid ${cat.icon || 'fa-tag'} text-[10px]`}></i>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div> */}

      {/* <div className="border-t border-slate-100/80 pt-3 space-y-2"> */}
      {/* Market Location Filters */}
      {/* <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <i className="fa-solid fa-location-dot text-amber-500"></i> Market Location
            </span>
            <button
              onClick={() => setShowFilterModal(true)}
              className="text-[11px] text-amber-600 font-extrabold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All ({markets.length})</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </button>
          </div> */}

      {/* <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2">
            <button
              onClick={() => { setSelectedMarket(''); updateFilters('market', ''); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border cursor-pointer transition-all flex items-center gap-1.5 ${!selectedMarket
                ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
            >
              <i className="fa-solid fa-city text-[10px]"></i>
              <span>All Markets</span>
            </button> */}

      {/* {markets.map((mkt, idx) => {
              const name = typeof mkt === 'object' ? (mkt.name || mkt.id) : mkt;
              const id = typeof mkt === 'object' ? (mkt.id || name || idx) : mkt;
              return (
                <button
                  key={id}
                  onClick={() => { setSelectedMarket(name); updateFilters('market', name); }}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border cursor-pointer transition-all flex items-center gap-1.5 ${selectedMarket === name
                    ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <i className="fa-solid fa-location-dot text-[10px]"></i>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div> */}

      {/* </div> */}

      {/* Compact Modern Shops Grid */}
      {filteredShops.length === 0 ? (
        <div className="w-full text-center py-16 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 p-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center text-2xl font-bold">
            <i className="fa-solid fa-store-slash"></i>
          </div>
          <h3 className="text-base font-black text-slate-900">No Shops Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
            We couldn't find any local store matching your parameters. Try clearing your search or switching market locations.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mt-2 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredShops.map(shop => {
            const logo = shop.image || shop.logoImage || DEFAULT_STORE_LOGO;
            const banner = shop.banner || shop.bannerImage || DEFAULT_COVER_BANNER;

            return (
              <div
                key={shop.id}
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                <div>
                  {/* Banner Image & Top Badges */}
                  <div className="h-28 sm:h-32 bg-slate-100 relative overflow-hidden">
                    <img
                      src={banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Top Right Rating Pill */}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-white/95 backdrop-blur-md text-slate-900 font-black text-[11px] flex items-center gap-1 shadow-xs">
                      <i className="fa-solid fa-star text-amber-400 text-xs"></i> {shop.rating || 5.0}
                    </span>

                    {/* Top Left Items Count Badge */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-950/75 backdrop-blur-md text-white font-bold text-[10px] flex items-center gap-1">
                      <i className="fa-solid fa-box text-emerald-400 text-[10px]"></i> {shop.productsCount || 0} Items
                    </span>
                  </div>

                  {/* Overlapping Logo & Shop Title info */}
                  <div className="px-4 pb-2">
                    <div className="flex items-end justify-between -mt-8 mb-3 relative z-10">
                      <div className="relative">
                        <img
                          src={logo}
                          alt={shop.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-3 border-white shadow-md bg-white"
                        />
                        {shop.verified && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#056839] text-white border border-white flex items-center justify-center text-[9px] font-black" title="Verified Seller">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-extrabold text-[#056839] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {shop.categoryName || shop.category || 'Store'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-[#056839] transition-colors leading-snug">
                          {shop.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
                        <i className="fa-solid fa-location-dot text-[#056839] text-xs flex-shrink-0"></i>
                        <span className="truncate">{shop.market || shop.address || 'Rampur Market'}</span>
                      </p>

                      <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed pt-1">
                        {shop.description || 'Verified local retailer operating in the heart of Rampur city marketplace.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Action Bar */}
                <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 mt-3">
                  <Link
                    to={`/shop/${shop.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 text-center bg-[#056839] hover:bg-emerald-800 active:scale-95 text-white font-medium text-xs rounded-xl transition-all shadow-xs"
                  >
                    Visit Shop
                  </Link>

                  <a
                    href={`https://wa.me/${(shop.whatsapp || shop.phone || '919876543210').replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(shop.name)}, I found your shop on Digital Meena Bazaar.`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8.5 h-8.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-2xs"
                    title="Contact Shop on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp text-base"></i>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Modal Dialog */}
      <ShopsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        categories={categories}
        markets={markets}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
        filteredCount={filteredShops.length}
        updateFilters={updateFilters}
      />

    </div>
  );
}
