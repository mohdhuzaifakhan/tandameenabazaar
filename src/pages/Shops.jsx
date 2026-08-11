import {
  MapPin,
  MessageCircle,
  RotateCcw,
  Star,
  Store
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CategoryFilterBar from '../components/CategoryFilterBar';
import ShopCard from '../components/ShopCard';
import ShopsFilterModal from '../components/ShopsFilterModal';
import { useBazaar } from '../context/BazaarContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { DEFAULT_STORE_LOGO } from '../utils/defaultAssets';
import { matchShopSearch } from '../utils/searchUtils';

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
  }, [searchParams, currentCity, setCurrentCity]);

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
    if (shop.verified === false) return false;

    const matchesSearch = matchShopSearch(shop, searchQuery);

    const matchesCategory = !selectedCategory || selectedCategory === 'all' ||
      shop.category === selectedCategory ||
      (shop.category && shop.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (shop.categoryName && shop.categoryName.toLowerCase() === selectedCategory.toLowerCase()) ||
      (categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === (shop.category || '').toLowerCase());

    const matchesMarket = !selectedMarket || shop.market === selectedMarket;

    const matchesCity = !currentCity || currentCity === 'All Cities' ||
      (shop.city ? shop.city === currentCity : (currentCity === 'Rampur'));

    return matchesSearch && matchesCategory && matchesMarket && matchesCity;
  });

  if (sortBy === 'rating') {
    filteredShops = [...filteredShops].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const {
    displayedItems: displayedShops,
    hasMore: hasMoreShops,
    isLoadingMore: isLoadingMoreShops,
    sentinelRef: shopSentinelRef,
    totalCount: totalShopsCount
  } = useInfiniteScroll({ items: filteredShops, initialCount: 6, pageSize: 6 });

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] pb-24 font-sans text-slate-800">

      {/* --- 1. STICKY SCROLLABLE CATEGORIES BAR (spans full width for sticky to work) --- */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          const val = catName === 'all' ? '' : catName;
          setSelectedCategory(val);
          updateFilters('category', val);
        }}
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4 pt-2 sm:pt-4">

        {/* --- 4. SHOPS DIRECTORY GRID WITH INFINITE SCROLL --- */}
        {filteredShops.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {displayedShops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>

            {/* Sentinel Observer & End Message */}
            {hasMoreShops && (
              <div ref={shopSentinelRef} className="w-full py-4 text-center">
                {isLoadingMoreShops && (
                  <span className="text-xs font-bold text-slate-400 animate-pulse">Loading more stores...</span>
                )}
              </div>
            )}

            {!hasMoreShops && totalShopsCount > 0 && (
              <div className="w-full py-4 text-center">
                <span className="text-xs font-bold text-slate-400">All verified stores loaded ({totalShopsCount} stores)</span>
              </div>
            )}
          </div>
        ) : (
          /* Empty Shops State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center mx-auto border border-emerald-100">
              <Store className="w-7 h-7 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">No Shops Match Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium mt-1">
                We couldn't find any local store matching your parameters. Try clearing your search or switching locations.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>

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
