import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';

export default function Header({ onOpenDrawer }) {
  const { savedProductIds } = useBazaar();
  const { userProfile, logout: authLogout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await authLogout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#056839] font-bold border-b-2 border-[#056839] pb-1'
      : 'text-slate-600 hover:text-[#056839] font-medium transition-colors pb-1';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo matching reference design */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[#056839] text-white flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-sm font-black text-slate-900 tracking-tight">Meena Bazaar</span>
            <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">Local shops, verified sellers</span>
          </div>
        </Link>

        {/* Desktop Center: Search input + Location pill matching reference */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search products, shops, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-[#056839] bg-slate-50/50 font-medium"
            />
          </div>

          <div className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-1.5 flex-shrink-0">
            <i className="fa-solid fa-location-dot text-[#056839]"></i>
            <span>Rampur, UP</span>
            <i className="fa-solid fa-chevron-down text-[9px] text-slate-400"></i>
          </div>
        </form>

        {/* Desktop Right: Navigation links & user controls */}
        <div className="hidden md:flex items-center gap-6">

          <nav className="flex items-center gap-6 text-xs">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shops" className={isActive('/shops')}>Shops</Link>
            <Link to="/shops" className={isActive('/categories')}>Categories</Link>
            <Link to="/saved" className={isActive('/saved')}>Saved</Link>
          </nav>

          {/* Saved wishlist button */}
          <Link
            to="/saved"
            className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-200/60"
            title="Saved Wishlist"
          >
            <i className="fa-regular fa-heart text-sm"></i>
            {savedProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedProductIds.length}
              </span>
            )}
          </Link>

          {/* User profile avatar / Merchant Login */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link
                to={userProfile.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
                className="flex items-center gap-2"
                title="View Dashboard"
              >
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#056839]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#056839] text-white font-bold flex items-center justify-center text-xs border-2 border-[#056839]">
                    {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white transition-all font-bold text-xs flex items-center gap-1.5"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/saved"
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200/60 relative"
          >
            <i className="fa-regular fa-heart text-xs"></i>
            {savedProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {savedProductIds.length}
              </span>
            )}
          </Link>
          <button
            onClick={onOpenDrawer}
            className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200"
          >
            <i className="fa-solid fa-bars text-xs"></i>
          </button>
        </div>

      </div>

    </header>
  );
}
