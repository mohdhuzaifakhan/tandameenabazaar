import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function Header({ onOpenDrawer }) {
  const { savedProductIds, currentUser, logout } = useBazaar();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const showSearch = location.pathname === '/' || location.pathname.startsWith('/product/');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthClick = () => {
    if (currentUser && currentUser.role !== 'guest') {
      logout();
      navigate('/');
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-600 font-bold'
      : 'text-slate-600 hover:text-emerald-600 font-semibold';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-white flex items-center justify-center text-xs border border-emerald-900">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <span className="text-sm font-black text-slate-900 leading-none">Meena Bazaar</span>
        </Link>

        {/* Desktop Center: Search bar (Home & Product pages only) */}
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block animate-fade-in">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search stores, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/40"
            />
          </form>
        ) : (
          <div className="flex-1 hidden md:block" />
        )}

        {/* Desktop Right: Nav + Actions */}
        <div className="hidden md:flex items-center gap-2.5">

          <nav className="hidden lg:flex items-center gap-5 mr-2 text-xs font-semibold">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shops" className={isActive('/shops')}>Shops</Link>
            <Link to="/saved" className={isActive('/saved')}>Saved</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </nav>

          {/* Saved heart — desktop */}
          <Link
            to="/saved"
            className="relative w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-200"
            title="Saved Products"
          >
            <i className="fa-regular fa-heart text-sm"></i>
            {savedProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedProductIds.length}
              </span>
            )}
          </Link>

          {/* Auth — desktop */}
          {currentUser && currentUser.role !== 'guest' ? (
            <div className="flex items-center gap-1.5">
              <Link
                to={currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
                className="flex px-3 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-bold text-xs items-center gap-1"
              >
                <i className="fa-solid fa-gauge"></i> Panel
              </Link>
              <button
                onClick={handleAuthClick}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center justify-center text-xs cursor-pointer border border-red-100"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-bold text-xs flex items-center gap-1"
            >
              <i className="fa-regular fa-user"></i> Login
            </Link>
          )}
        </div>

        {/* Mobile Right: nothing — all mobile actions are in the bottom nav */}
        {/* (intentionally empty on mobile to keep header clean) */}

      </div>

    </header>
  );
}
