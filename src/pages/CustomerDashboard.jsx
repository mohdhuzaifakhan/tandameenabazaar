import {
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  Headphones,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ShopCard from '../components/ShopCard';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { matchProductSearch } from '../utils/searchUtils';

export default function CustomerDashboard() {
  const { userProfile, logout } = useAuth();
  const { products, savedProductIds, followedShopIds, toggleFollowShop, currentCity, setCurrentCity, cities, shops, markets, categories } = useBazaar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'shops' | 'markets' | 'account'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter saved products
  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  // Filter followed shops
  const followedShops = shops.filter(s => followedShopIds.includes(s.id) && !s.deleted);

  // Filter saved products by category and search
  const filteredSavedProducts = savedProducts.filter(p => {
    const matchesSearch = matchProductSearch(p, searchQuery);

    const matchesCategory = selectedCategory === 'all' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Filter shops by current city
  const cityShops = shops.filter(s => currentCity === 'All Cities' || s.city === currentCity);

  // Safely normalize markets data to ensure proper object structure
  const normalizedMarkets = (markets || []).map((m, idx) => {
    if (typeof m === 'string') {
      return {
        id: m.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: m,
        city: 'Rampur',
        area: 'Main City Area',
        description: 'Major commercial market and retail hub in Rampur.'
      };
    }
    return {
      id: m.id || (m.name ? m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `mkt-${idx}`),
      name: m.name || m.id || 'Local Market',
      city: m.city || 'Rampur',
      area: m.area || m.city || 'Main City Area',
      description: m.description || `Famous local market area serving shoppers in ${m.city || 'Rampur'}.`
    };
  });

  // Filter markets by current city (case-insensitive)
  const cityMarkets = normalizedMarkets.filter(m =>
    currentCity === 'All Cities' ||
    (m.city && m.city.toLowerCase() === currentCity.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Helper for user initials
  const getInitials = (name) => {
    if (!name) return 'AK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4 pt-3 sm:pt-4">

        {/* --- 2. CUSTOMER PROFILE BIG CARD --- */}
        <div className="bg-[#f4fbf7] rounded-3xl border border-emerald-100/90 p-4 sm:p-6 space-y-4">

          {/* Main User Profile Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Large Circular Avatar with solid check mark badge */}
              <div className="relative shrink-0">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || 'Customer'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#056839] flex items-center justify-center text-xl font-extrabold border-2 border-white">
                    {getInitials(userProfile?.displayName)}
                  </div>
                )}

                {/* Small Green Checkmark Badge on Bottom Right */}
                <div className="w-5 h-5 rounded-full bg-[#056839] text-white flex items-center justify-center text-[10px] absolute bottom-0 right-0 border-2 border-white">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>

              {/* Name, Verified Badge & Email */}
              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {userProfile?.displayName || 'Abuhuraira Khan'}
                </h1>

                <div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-emerald-300/80 text-[#056839] text-[9.5px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#056839]" /> VERIFIED CUSTOMER
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{userProfile?.email || 'abuhuraira93893@gmail.com'}</span>
                </p>
              </div>
            </div>

            {/* Far Right Chevron */}
            <button
              onClick={() => setActiveTab('account')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* City Selector Pill & Logout Button Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-100/60">
            {/* City Selector */}
            <div className="px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs font-bold text-[#056839] flex items-center gap-1.5 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#056839]" />
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="bg-transparent text-[#056839] font-bold text-xs outline-none cursor-pointer"
              >
                <option value="All Cities">All Cities</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>

          {/* 4 STAT CARDS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* 1. Saved Items */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`bg-white rounded-2xl border p-3 text-left space-y-1 transition-all cursor-pointer ${activeTab === 'saved' ? 'border-[#056839]' : 'border-emerald-100/80 hover:border-emerald-200'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <div className="text-xl font-black text-slate-900">{savedProducts.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Saved Items</div>
              <div className="text-[10.5px] font-extrabold text-rose-600 flex items-center gap-0.5 pt-0.5">
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* 2. Following Shops */}
            <button
              onClick={() => setActiveTab('shops')}
              className={`bg-white rounded-2xl border p-3 text-left space-y-1 transition-all cursor-pointer ${activeTab === 'shops' ? 'border-[#056839]' : 'border-emerald-100/80 hover:border-emerald-200'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Store className="w-4 h-4 text-[#056839]" />
              </div>
              <div className="text-xl font-black text-slate-900">{followedShops.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Following Shops</div>
              <div className="text-[10.5px] font-extrabold text-[#056839] flex items-center gap-0.5 pt-0.5">
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* 3. Active Orders / Enquiries */}
            <div className="bg-white rounded-2xl border border-emerald-100/80 p-3 text-left space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#056839]" />
              </div>
              <div className="text-xl font-black text-slate-900">0</div>
              <div className="text-[11px] font-bold text-slate-600">Active Orders</div>
              <div className="text-[10.5px] font-extrabold text-[#056839] flex items-center gap-0.5 pt-0.5">
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* 4. Nearby Markets */}
            <button
              onClick={() => setActiveTab('markets')}
              className={`bg-white rounded-2xl border p-3 text-left space-y-1 transition-all cursor-pointer ${activeTab === 'markets' ? 'border-[#056839]' : 'border-emerald-100/80 hover:border-emerald-200'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#056839]" />
              </div>
              <div className="text-xl font-black text-slate-900">{cityMarkets.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Nearby Markets</div>
              <div className="text-[10.5px] font-extrabold text-[#056839] flex items-center gap-0.5 pt-0.5">
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>

        {/* --- 3. SEGMENTED TAB CONTROL BAR --- */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {/* Tab 1: Saved Items */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'saved'
              ? 'bg-[#056839] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-white' : ''}`} />
            <span>Saved Items ({savedProducts.length})</span>
          </button>

          {/* Tab 2: Following Shops */}
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'shops'
              ? 'bg-[#056839] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Store className="w-4 h-4" />
            <span>Following Shops ({followedShops.length})</span>
          </button>

          {/* Tab 3: Markets */}
          <button
            onClick={() => setActiveTab('markets')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'markets'
              ? 'bg-[#056839] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Building className="w-4 h-4" />
            <span>Markets ({cityMarkets.length})</span>
          </button>

          {/* Tab 4: Account */}
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${activeTab === 'account'
              ? 'bg-[#056839] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Account</span>
          </button>
        </div>

        {/* --- 4. MAIN TAB CONTENT BOX --- */}

        {/* TAB 1: SAVED ITEMS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedProducts.length > 0 ? (
              <div className="space-y-3">
                {/* Search & Category Filter Bar */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search saved items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-[#056839] font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shrink-0 ${selectedCategory === 'all' ? 'bg-[#056839] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      All ({savedProducts.length})
                    </button>

                    {categories.map(cat => {
                      const count = savedProducts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                      if (count === 0) return null;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shrink-0 ${selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-[#056839] text-white'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredSavedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              /* EXACT EMPTY SAVED WISHLIST CARD FROM IMAGE */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
                {/* Heart in soft green circle with sparkle accents */}
                <div className="relative w-20 h-20 rounded-full bg-[#f4fbf7] text-[#056839] flex items-center justify-center mx-auto border border-emerald-100">
                  <Heart className="w-10 h-10 text-[#056839] stroke-[2]" />
                  <Sparkles className="w-4 h-4 text-emerald-400 absolute top-2 right-2" />
                  <Sparkles className="w-3 h-3 text-emerald-400 absolute bottom-3 left-2" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Your Saved List is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium mt-1">
                    Browse products from shops in {currentCity === 'All Cities' ? 'Rampur' : currentCity} and tap the heart icon to save items here!
                  </p>
                </div>

                <div>
                  <Link
                    to="/shops"
                    className="px-6 py-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" /> Explore Local Marketplace
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FOLLOWING SHOPS */}
        {activeTab === 'shops' && (
          <div className="space-y-3">
            {followedShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                {followedShops.map(shop => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
                <div className="relative w-20 h-20 rounded-full bg-[#f4fbf7] text-[#056839] flex items-center justify-center mx-auto border border-emerald-100">
                  <Store className="w-10 h-10 text-[#056839] stroke-[2]" />
                  <Sparkles className="w-4 h-4 text-emerald-400 absolute top-2 right-2" />
                  <Sparkles className="w-3 h-3 text-emerald-400 absolute bottom-3 left-2" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Not Following Any Shops Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium mt-1">
                    Explore stores in {currentCity === 'All Cities' ? 'Rampur' : currentCity} and follow your favorite local shops to quickly access them here!
                  </p>
                </div>

                <div>
                  <Link
                    to="/shops"
                    className="px-6 py-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" /> Discover Shops Directory
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MARKETS */}
        {activeTab === 'markets' && (
          <div className="space-y-3">
            {cityMarkets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cityMarkets.map(market => (
                  <div key={market.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black text-[#056839] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {market.city}
                        </span>
                        <h3 className="font-black text-base text-slate-900 mt-1">{market.name}</h3>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#056839]" /> {market.area || market.city}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center font-bold shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {market.description}
                    </p>

                    <Link
                      to={`/shops?market=${encodeURIComponent(market.name)}`}
                      className="text-xs font-extrabold text-[#056839] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Explore Market Shops</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center mx-auto border border-emerald-100">
                  <Building className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-black text-slate-900">No Markets Listed in {currentCity}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Switch your city filter to "All Cities" or "Rampur" to explore nearby bazaar markets.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setCurrentCity('All Cities')}
                    className="px-5 py-2.5 rounded-xl bg-[#056839] text-white text-xs font-extrabold cursor-pointer"
                  >
                    View All Cities Markets
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACCOUNT */}
        {activeTab === 'account' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">Account Details</h2>
                  <p className="text-xs text-slate-500 font-medium">Customer Profile Information</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Name</span>
                  <span className="font-extrabold text-slate-900">{userProfile?.displayName || 'Abuhuraira Khan'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Email</span>
                  <span className="font-extrabold text-slate-900">{userProfile?.email || 'abuhuraira93893@gmail.com'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Account Role</span>
                  <span className="font-extrabold text-[#056839] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Customer
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Active City</span>
                  <span className="font-extrabold text-slate-900">{currentCity}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out Account
              </button>
            </div>
          </div>
        )}

        {/* --- 5. QUICK LINKS CARD (EXACT CARD FROM SCREENSHOT) --- */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Quick Links</h3>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Delivery Addresses */}
            <div className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-slate-600" />
                <span className="font-bold text-slate-800">Delivery Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Payment Methods */}
            <div className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4.5 h-4.5 text-slate-600" />
                <span className="font-bold text-slate-800">Payment Methods</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Help & Support */}
            <Link to="/contact" className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Headphones className="w-4.5 h-4.5 text-slate-600" />
                <span className="font-bold text-slate-800">Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Settings */}
            <div className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-4.5 h-4.5 text-slate-600" />
                <span className="font-bold text-slate-800">Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
