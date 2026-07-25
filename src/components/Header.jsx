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

  const showSearch = location.pathname === '/' || location.pathname.startsWith('/product/');

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
      ? 'text-emerald-600 font-bold'
      : 'text-slate-600 hover:text-emerald-600 font-semibold';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-xs">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 text-white flex items-center justify-center text-sm border border-emerald-900 shadow-sm group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-black text-slate-900 leading-none tracking-tight">Meena Bazaar</span>
            <span className="text-[10px] font-bold text-emerald-700 leading-none mt-1">Find shops in your city</span>
          </div>
        </Link>

        {/* Desktop Center: Search bar */}
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
        <div className="hidden md:flex items-center gap-3">

          <nav className="hidden lg:flex items-center gap-5 mr-2 text-xs font-semibold">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shops" className={isActive('/shops')}>Shops</Link>
            <Link to="/saved" className={isActive('/saved')}>Saved</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </nav>

          {/* Saved heart */}
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

          {/* Auth user state & Dashboard Link Button */}
          {userProfile ? (
            <div className="flex items-center gap-2">

              {/* Direct Dashboard Button */}
              <Link
                to={userProfile.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
                className="flex px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500 transition-all font-bold text-xs items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <i className="fa-solid fa-store"></i>
                <span>{userProfile.role === 'admin' ? 'Admin Panel' : 'My Shop Dashboard'}</span>
              </Link>

              {/* Logged in User Profile Pill */}
              <div className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">
                    {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="font-bold text-slate-800 max-w-[100px] truncate">
                  {userProfile.displayName || userProfile.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-6 h-6 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center text-xs ml-1 cursor-pointer"
                  title="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Merchant Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex md:hidden items-center gap-2">
          {userProfile && (
            <Link
              to={userProfile.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
              className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
            >
              <i className="fa-solid fa-store"></i> Shop
            </Link>
          )}
          <button
            onClick={onOpenDrawer}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200"
          >
            <i className="fa-solid fa-bars text-sm"></i>
          </button>
        </div>

      </div>

    </header>
  );
}
