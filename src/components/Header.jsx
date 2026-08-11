import {
  Check,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Store,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { matchProductSearch, matchShopSearch } from '../utils/searchUtils';

export default function Header({ onOpenDrawer: _onOpenDrawer }) {
  const { products, shops, savedProductIds, currentCity, setCurrentCity, cities } = useBazaar();
  const { userProfile, currentUser, logout: authLogout } = useAuth();
  const activeUser = userProfile || currentUser;
  const profilePath = activeUser
    ? activeUser.role === 'admin'
      ? '/dashboard/admin'
      : activeUser.role === 'shop_owner'
        ? '/dashboard/shop'
        : '/dashboard/customer'
    : '/login';
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const searchContainerRef = useRef(null);
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowLiveSearch(false);
      }
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setShowDesktopDropdown(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setShowMobileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    setCurrentCity(city);
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);

    if (location.pathname === '/shops') {
      const newParams = new URLSearchParams(location.search);
      if (city && city !== 'All Cities') {
        newParams.set('city', city);
      } else {
        newParams.delete('city');
      }
      navigate(`/shops?${newParams.toString()}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowLiveSearch(false);
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectLiveResult = (url) => {
    setShowLiveSearch(false);
    navigate(url);
  };

  // Live Instant Search Filtered Results
  const matchingProducts = searchQuery.trim()
    ? products.filter(p => matchProductSearch(p, searchQuery)).slice(0, 4)
    : [];

  const matchingShops = searchQuery.trim()
    ? shops.filter(s => matchShopSearch(s, searchQuery)).slice(0, 3)
    : [];

  const handleLogout = async () => {
    await authLogout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#056839] font-bold border-b-2 border-[#056839] pb-1 tracking-wide'
      : 'text-slate-600 hover:text-[#056839] font-semibold tracking-wide transition-colors pb-1';

  // Scroll to top when clicking a nav link you're already on
  const handleNavClick = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">

        {/* Brand Logo with display typography */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-2xl bg-[#056839] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4.5 h-4.5 text-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-extrabold text-[15px] md:text-base text-slate-900 tracking-tight">Meena Bazaar</span>
            <span className="text-[9px] md:text-[9.5px] font-black text-[#056839] mt-0.5 tracking-wider uppercase">
              {currentCity === 'All Cities' ? 'Local Marketplace' : `${currentCity} Shops`}
            </span>
          </div>
        </Link>

        {/* Desktop Center: Search input + Location pill container */}
        <div className="flex-1 max-w-lg relative hidden md:flex items-center gap-2" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, shops, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowLiveSearch(true);
              }}
              onFocus={() => setShowLiveSearch(true)}
              className="w-full pl-9 pr-8 py-2 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-[#056839] bg-slate-50/50 font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setShowLiveSearch(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Floating Instant Search Dropdown Results */}
            {showLiveSearch && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-3 max-h-[75vh] overflow-y-auto">
                {matchingProducts.length === 0 && matchingShops.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 font-semibold text-xs space-y-1">
                    <p>No instant results for "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="text-xs font-black text-[#056839] hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Press Enter to search entire catalog
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Matching Shops Section */}
                    {matchingShops.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
                          <Store className="w-3 h-3 text-[#056839]" /> Matching Stores ({matchingShops.length})
                        </div>
                        <div className="space-y-1">
                          {matchingShops.map(s => (
                            <div
                              key={s.id}
                              onClick={() => handleSelectLiveResult(`/shop/${s.id}`)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors"
                            >
                              <img src={s.image} alt={s.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-extrabold text-slate-900 truncate">{s.name}</h4>
                                <span className="text-[10.5px] text-slate-500 font-semibold block truncate">{s.market || s.city}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products Section */}
                    {matchingProducts.length > 0 && (
                      <div className="space-y-1.5 border-t border-slate-100 pt-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
                          <Package className="w-3 h-3 text-[#056839]" /> Matching Products ({matchingProducts.length})
                        </div>
                        <div className="space-y-1">
                          {matchingProducts.map(p => (
                            <div
                              key={p.id}
                              onClick={() => handleSelectLiveResult(`/categories?search=${encodeURIComponent(p.name)}`)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors"
                            >
                              <img src={p.image || (p.images && p.images[0])} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                                <span className="text-[10.5px] text-emerald-800 font-extrabold block">₹{Number(p.price).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer View All Search Results */}
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-2.5 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs text-center transition-colors cursor-pointer border-none"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </>
                )}
              </div>
            )}
          </form>

          {/* Desktop City Selector Dropdown */}
          <div className="relative" ref={desktopRef}>
            <button
              type="button"
              onClick={() => setShowDesktopDropdown(!showDesktopDropdown)}
              className="px-3 py-2 bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 rounded-xl text-xs text-[#056839] font-black flex items-center gap-1.5 flex-shrink-0 tracking-tight cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#056839]" />
              <span>{currentCity}</span>
              <ChevronDown className={`w-3 h-3 text-[#056839] transition-transform ${showDesktopDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDesktopDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Select City
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectCity('All Cities')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${currentCity === 'All Cities' ? 'bg-[#056839] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>All Cities</span>
                    {currentCity === 'All Cities' && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {cities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${currentCity === city ? 'bg-[#056839] text-white' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Right: Navigation links & user controls */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-xs font-semibold">
            <Link to="/" className={isActive('/')} onClick={() => handleNavClick('/')}>Home</Link>
            {/* <Link to="/shops" className={isActive('/shops')} onClick={() => handleNavClick('/shops')}>Shops</Link> */}
            <Link to="/categories" className={isActive('/categories')} onClick={() => handleNavClick('/categories')}>Categories</Link>
            <Link to="/saved" className={isActive('/saved')} onClick={() => handleNavClick('/saved')}>Saved</Link>
          </nav>
          {/* User profile avatar / Merchant Login */}
          {activeUser ? (
            <div className="flex items-center gap-2">
              <Link
                to={profilePath}
                className="flex items-center gap-2"
                title={activeUser.role === 'admin' ? 'Admin Panel' : (activeUser.role === 'shop_owner' ? 'Shop Dashboard' : 'Customer Account')}
              >
                {activeUser.photoURL ? (
                  <img
                    src={activeUser.photoURL}
                    alt={activeUser.displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#056839]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#056839] text-white font-bold flex items-center justify-center text-xs border-2 border-[#056839]">
                    {activeUser.displayName ? activeUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer border-none bg-transparent"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white transition-all font-bold text-xs flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Header Right Actions (City Selector, Wishlist & Notifications) */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile City Selector Pill */}
          <div className="relative" ref={mobileRef}>
            <button
              type="button"
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-[#056839] font-black flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#056839]" />
              <span className="max-w-[70px] truncate">{currentCity}</span>
              <ChevronDown className="w-3 h-3 text-[#056839]" />
            </button>

            {showMobileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[100]">
                <div className="px-2.5 py-1 text-[9.5px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Select City
                </div>
                <div className="max-h-52 overflow-y-auto space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectCity('All Cities')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center justify-between ${currentCity === 'All Cities' ? 'bg-[#056839] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>All Cities</span>
                    {currentCity === 'All Cities' && <Check className="w-3 h-3 text-white" />}
                  </button>

                  {cities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center justify-between ${currentCity === city ? 'bg-[#056839] text-white' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/saved"
            className="w-8 h-8 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 relative"
            title="Saved Items"
          >
            <Heart className="w-4 h-4 text-slate-700 stroke-[2]" />
            {savedProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#056839] text-white font-extrabold text-[9px] flex items-center justify-center">
                {savedProductIds.length}
              </span>
            )}
          </Link>

          {/* <button
            type="button"
            className="w-8 h-8 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 relative border-none cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 stroke-[2]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#056839] border border-white" />
          </button> */}
        </div>

      </div>
    </header>
  );
}
