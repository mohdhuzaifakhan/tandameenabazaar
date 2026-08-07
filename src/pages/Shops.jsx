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

    const matchesSearch = !searchQuery ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.market && shop.market.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shop.address && shop.address.toLowerCase().includes(searchQuery.toLowerCase()));

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

        {/* --- 4. SHOPS DIRECTORY GRID --- */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredShops.map(shop => {
              const displayImage = shop.image || shop.logoImage || shop.banner || DEFAULT_STORE_LOGO;

              return (
                <div
                  key={shop.id}
                  onClick={() => navigate(`/shop/${shop.id}`)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 space-y-3 cursor-pointer group hover:border-[#056839] transition-all"
                >
                  {/* Top Image Preview & Details */}
                  <div className="flex items-center gap-3">
                    <img
                      src={displayImage}
                      alt={shop.name}
                      className="w-13 h-13 rounded-xl object-cover border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-[#056839] transition-colors">
                          {shop.name}
                        </h3>
                        <span className="text-[10px] font-extrabold text-[#056839] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0 uppercase tracking-wider">
                          Verified
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#056839] shrink-0" />
                        <span>{shop.market || shop.address || shop.city}</span>
                      </p>
                    </div>
                  </div>

                  {/* Shop Info Pill Row */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="truncate">Category: {shop.categoryName || shop.category || 'Retail Store'}</span>
                    <div className="flex items-center gap-1 text-slate-900 font-extrabold shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{Number(shop.rating || 4.5).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-snug">
                    {shop.description || 'Verified storefront serving customers on Meena Bazaar.'}
                  </p>

                  {/* Action Buttons Footer */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <Link
                      to={`/shop/${shop.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2 px-3 text-center bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors"
                    >
                      Visit Shop
                    </Link>

                    {shop.whatsapp && (
                      <a
                        href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                          ` *SHOP INQUIRY - MEENA BAZAAR*\n\n• *Shop Name:* ${shop.name}\n• *Location:* ${shop.market || 'Local Market'}, ${shop.city || 'Rampur'}\n• *Category:* ${shop.categoryName || shop.category || 'Local Shop'}\n\n *Hello ${shop.name}, I found your shop on Meena Bazaar and would like to inquire about your products.*`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-emerald-50 text-[#056839] border border-emerald-200 hover:bg-emerald-100 text-xs flex items-center justify-center shrink-0"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
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
