import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function Footer({ onOpenDrawer }) {
  const { savedProductIds, currentUser } = useBazaar();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-600'
      : 'text-slate-400';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const profilePath =
    currentUser && currentUser.role !== 'guest'
      ? currentUser.role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/shop'
      : '/login';

  const isProfileActive =
    location.pathname === '/login' ||
    location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* ── Desktop/Tablet Footer ── */}
      <footer className="hidden md:block w-full border-t border-slate-100 bg-white py-12 px-4 md:px-6 mt-16 text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-white flex items-center justify-center text-sm border border-emerald-900">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <span className="font-black text-slate-900 text-sm tracking-tight">Meena Bazaar</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Empowering local commerce in Rampur. Discover verified storefronts, browse catalogs, and order directly via WhatsApp.
            </p>
            <div className="mt-2 text-xs text-slate-500 font-semibold">
              Developed &amp; Managed by <br />
              <span className="text-slate-950 font-black tracking-tight">Unifiedstack</span> <br />
              <span className="text-[10px] text-slate-400">Software Solutions Company</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-500">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <Link to="/shops" className="hover:text-emerald-600 transition-colors">Shops Directory</Link>
              <Link to="/saved" className="hover:text-emerald-600 transition-colors">Saved Products</Link>
              <Link to="/about" className="hover:text-emerald-600 transition-colors">About Marketplace</Link>
              <Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact Support</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">Contact &amp; Support</h4>
            <div className="flex flex-col gap-3 text-xs font-medium text-slate-500">
              <a href="mailto:mohdhuzaifa8126195456@gmail.com" className="flex items-center gap-2 hover:text-emerald-650 transition-colors">
                <i className="fa-regular fa-envelope text-emerald-600 text-sm"></i>
                <span>mohdhuzaifa8126195456@gmail.com</span>
              </a>
              <a href="tel:8433043426" className="flex items-center gap-2 hover:text-emerald-650 transition-colors">
                <i className="fa-solid fa-phone text-emerald-600 text-sm"></i>
                <span>+91 8433043426</span>
              </a>
              <a
                href="https://wa.me/918433043426?text=Hello Unifiedstack, I have a query about Digital Meena Bazaar."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-emerald-650 transition-colors"
              >
                <i className="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                <span>Direct WhatsApp Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-450 font-semibold">
          <span>&copy; 2026 Digital Meena Bazaar. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by <strong className="text-slate-700">Unifiedstack</strong> Solutions
          </span>
        </div>
      </footer>

      {/* ── Mobile Footer (simple copyright only) ── */}
      <footer className="md:hidden w-full border-t border-slate-100 bg-slate-50 py-4 px-4 pb-20 text-center text-[10px] text-slate-400 font-semibold">
        &copy; 2026 Digital Meena Bazaar &bull; Powered by <strong className="text-slate-600">Unifiedstack</strong>
      </footer>

      {/* ── Mobile Search Overlay ── */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex flex-col">
          {/* Search panel slides up from top */}
          <div className="bg-white px-4 pt-12 pb-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-black text-slate-900">Search</span>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer border-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
              <input
                autoFocus
                type="text"
                placeholder="Search stores, products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-500 bg-slate-50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer border-none bg-transparent"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              )}
            </form>
            {/* Quick navigation suggestions */}
            <div className="flex flex-wrap gap-2 mt-1">
              {['Mobile', 'Fashion', 'Electronics', 'Footwear', 'Groceries'].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    navigate(`/shops?search=${tag}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-full text-xs font-bold transition-colors cursor-pointer border-none"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {/* Tap backdrop to close */}
          <div className="flex-1" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
        </div>
      )}

      {/* ── LinkedIn-style Mobile Bottom Nav Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 safe-area-bottom">
        <div className="flex justify-around items-center h-[58px] px-1">

          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-colors"
          >
            <i className={`fa-solid fa-house text-[20px] ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-400'}`}></i>
            <span className={`text-[10px] ${location.pathname === '/' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}`}>Home</span>
          </Link>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-colors cursor-pointer border-none bg-transparent text-slate-400"
          >
            <i className="fa-solid fa-magnifying-glass text-[20px]"></i>
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {/* Shops */}
          <Link
            to="/shops"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-colors"
          >
            <i className={`fa-solid fa-store text-[20px] ${location.pathname === '/shops' ? 'text-emerald-600' : 'text-slate-400'}`}></i>
            <span className={`text-[10px] ${location.pathname === '/shops' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}`}>Shops</span>
          </Link>

          {/* Saved */}
          <Link
            to="/saved"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 relative transition-colors"
          >
            <i className={`fa-${location.pathname === '/saved' ? 'solid' : 'regular'} fa-heart text-[20px] ${location.pathname === '/saved' ? 'text-emerald-600' : 'text-slate-400'}`}></i>
            <span className={`text-[10px] ${location.pathname === '/saved' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}`}>Saved</span>
            {savedProductIds.length > 0 && (
              <span className="absolute top-1.5 right-[calc(50%-10px)] bg-red-500 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedProductIds.length}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to={profilePath}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-colors"
          >
            <i className={`fa-${isProfileActive ? 'solid' : 'regular'} fa-user text-[20px] ${isProfileActive ? 'text-emerald-600' : 'text-slate-400'}`}></i>
            <span className={`text-[10px] ${isProfileActive ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}`}>Profile</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
