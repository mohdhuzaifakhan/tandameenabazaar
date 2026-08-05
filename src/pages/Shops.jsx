import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ShopsFilterModal from '../components/ShopsFilterModal';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function Shops() {
  const { shops, categories, markets, cities, currentCity, setCurrentCity } = useBazaar();
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

    const urlCity = searchParams.get('city');
    if (urlCity && urlCity !== currentCity) {
      setCurrentCity(urlCity);
    }
  }, [searchParams]);

  // Update query params helper
  const updateFilters = (key, value) => {
    if (key === 'city') {
      setCurrentCity(value || 'All Cities');
    }
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All Cities') {
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
    setCurrentCity('All Cities');
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

    const matchesCity = !currentCity || currentCity === 'All Cities' ||
      (shop.city ? shop.city === currentCity : (currentCity === 'Rampur'));

    return matchesSearch && matchesCategory && matchesMarket && matchesCity;
  });

  if (sortBy === 'rating') {
    filteredShops = [...filteredShops].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const isFiltered = Boolean(searchQuery || selectedCategory || selectedMarket || (currentCity && currentCity !== 'All Cities'));
  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedMarket ? 1 : 0) + (currentCity && currentCity !== 'All Cities' ? 1 : 0);

  const categoryObj = categories.find(c => c.id === selectedCategory);
  const categoryName = categoryObj ? categoryObj.name : selectedCategory;

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 py-3 sm:py-5 animate-fade-in pb-20 md:pb-12 max-w-7xl mx-auto">

      {/* Search Input Bar (Matches exact screenshot layout) */}
      {/* <div className="w-full">
        <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:border-[#056839] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#056839]/10 transition-all">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm ml-0.5 mr-3 flex-shrink-0"></i>
          <input
            type="text"
            placeholder="Search shops, products..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              updateFilters('search', e.target.value);
            }}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                updateFilters('search', '');
              }}
              className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0 cursor-pointer"
              title="Clear search"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className="text-slate-500 hover:text-[#056839] p-1 flex-shrink-0 border-l border-slate-200 pl-2.5 ml-1 cursor-pointer"
              title="Filter shops"
            >
              <i className="fa-solid fa-sliders text-sm"></i>
            </button>
          )}
        </div>
      </div> */}

      {/* Header Section: Title + Verified Badge + Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Shops
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#056839] border border-[#C8E6C9]/60 text-xs font-extrabold flex items-center gap-1 shadow-2xs">
              {filteredShops.length} Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Discover trusted local shops in {currentCity && currentCity !== 'All Cities' ? currentCity : 'your city'}
          </p>
        </div>
      </div>

      {/* Filter Action Row: All Filters Button + Sort Dropdown */}
      <div className="flex items-center gap-3 w-full">
        {/* All Filters Button */}
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${activeFilterCount > 0
            ? 'bg-[#056839] text-white border-[#056839]'
            : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
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

        {/* Sort By Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:w-52">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-8 rounded-xl border border-slate-200/80 bg-white text-xs sm:text-sm font-extrabold text-slate-700 outline-none cursor-pointer shadow-2xs hover:border-slate-300 transition-all"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
        </div>

        {/* Reset Filters button if filters applied (Desktop view) */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="hidden sm:flex px-3.5 py-2.5 text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer whitespace-nowrap items-center gap-1.5"
          >
            <i className="fa-solid fa-rotate-left text-[10px]"></i>
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Pills (if any filter is selected) */}
      {isFiltered && (
        <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
          {currentCity && currentCity !== 'All Cities' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200/70 font-bold text-xs">
              City: {currentCity}
              <button
                type="button"
                onClick={() => { updateFilters('city', 'All Cities'); }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[11px]"></i>
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#056839] border border-emerald-200/70 font-bold text-xs">
              Category: {categoryName}
              <button
                type="button"
                onClick={() => { setSelectedCategory(''); updateFilters('category', ''); }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[11px]"></i>
              </button>
            </span>
          )}
          {selectedMarket && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/70 font-bold text-xs">
              Market: {selectedMarket}
              <button
                type="button"
                onClick={() => { setSelectedMarket(''); updateFilters('market', ''); }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[11px]"></i>
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
              Search: "{searchQuery}"
              <button
                type="button"
                onClick={() => { setSearchQuery(''); updateFilters('search', ''); }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[11px]"></i>
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="sm:hidden text-xs font-bold text-rose-600 hover:underline ml-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Shops List Grid */}
      {filteredShops.length === 0 ? (
        <div className="w-full text-center py-16 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 p-6 shadow-xs mt-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center text-2xl font-bold">
            <i className="fa-solid fa-store-slash"></i>
          </div>
          <h3 className="text-base font-black text-slate-900">No Shops Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
            We couldn't find any local store matching your parameters. Try clearing your search or switching market locations.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mt-2 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mt-1">
          {filteredShops.map(shop => {
            const displayImage = shop.image || shop.logoImage || shop.banner || DEFAULT_STORE_LOGO;

            return (
              <div
                key={shop.id}
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 p-3 sm:p-4 flex gap-3.5 sm:gap-4 cursor-pointer group relative overflow-hidden"
              >
                {/* Left Image Thumbnail Container */}
                <div className="relative w-28 sm:w-36 md:w-36 h-auto aspect-square rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={displayImage}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Left Items Count Badge */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                    <i className="fa-solid fa-box text-emerald-400 text-[10px]"></i>
                    <span>{shop.productsCount || 0} Items</span>
                  </div>
                </div>

                {/* Right Shop Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Header Row: Shop Name & Category Badge */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <h3 className="flex-1 min-w-0 font-extrabold text-slate-900 text-sm sm:text-base truncate group-hover:text-[#056839] transition-colors leading-snug" title={shop.name}>
                        {shop.name}
                      </h3>
                      <span className="flex-shrink-0 max-w-[110px] sm:max-w-[130px] truncate text-[9.5px] sm:text-[10px] font-extrabold text-[#056839] bg-[#E8F5E9] border border-[#C8E6C9]/40 px-2 py-0.5 rounded-md uppercase tracking-wider" title={shop.categoryName || shop.category || 'Store'}>
                        {shop.categoryName || shop.category || 'Store'}
                      </span>
                    </div>

                    {/* Location Pin & Market */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-600">
                      <i className="fa-solid fa-location-dot text-[#056839] text-xs flex-shrink-0"></i>
                      <span className="truncate">{shop.market || shop.address || 'Rampur Market'}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-slate-700">
                      <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                      <span>{Number(shop.rating || 5.0).toFixed(1)}</span>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mt-1.5">
                      {shop.description || 'Official storefront serving customers on Meena Bazaar.'}
                    </p>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="flex items-center gap-2 mt-3 pt-0.5">
                    <Link
                      to={`/shop/${shop.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2 px-3 text-center bg-[#056839] hover:bg-[#04542e] active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center"
                    >
                      Visit Shop
                    </Link>

                    <a
                      href={`https://wa.me/${(shop.whatsapp || shop.phone || '919876543210').replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(shop.name)}, I found your shop on Digital Meena Bazaar.`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8.5 h-8.5 rounded-xl bg-[#E8F5E9] hover:bg-[#25D366] text-[#056839] hover:text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-2xs"
                      title="Contact Shop on WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                    </a>
                  </div>
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
        cities={cities}
        selectedCity={currentCity}
        setSelectedCity={setCurrentCity}
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
