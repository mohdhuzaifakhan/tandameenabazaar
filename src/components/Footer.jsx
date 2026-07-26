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
              <div className="w-8 h-8 rounded-lg bg-[#056839] text-white flex items-center justify-center text-sm">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <span className="font-display text-base font-extrabold text-slate-900 tracking-tight">Meena Bazaar</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
              Empowering local commerce in Rampur. Discover verified storefronts, browse catalogs, and order directly via WhatsApp.
            </p>
            <div className="mt-2 text-xs text-slate-500 font-semibold">
              Developed &amp; Managed by <br />
              <span className="font-display text-slate-950 font-bold tracking-tight">Unifiedstack</span> <br />
              <span className="text-[10px] text-slate-400 font-sans">Software Solutions Company</span>
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

      {/* ── Public Mobile Bottom Nav Bar (Ultra-Thin Line SVG Icons) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-1">

          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 transition-colors"
          >
            <svg className={`w-6 h-6 ${location.pathname === '/' ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21v-6a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v6" />
            </svg>
            <span className={`text-[11px] ${location.pathname === '/' ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>Home</span>
          </Link>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 transition-colors cursor-pointer border-none bg-transparent"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
            <span className="text-[11px] font-medium text-slate-700">Search</span>
          </button>

          {/* Shops */}
          <Link
            to="/shops"
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 transition-colors"
          >
            <svg className={`w-6 h-6 ${location.pathname === '/shops' ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H21m-9 0H3m18 0h-3m0 0h-3m0 0H9m-6 0h3m2.25-18h8.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75z" />
            </svg>
            <span className={`text-[11px] ${location.pathname === '/shops' ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>Shops</span>
          </Link>

          {/* Saved */}
          <Link
            to="/saved"
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 relative transition-colors"
          >
            <svg className={`w-6 h-6 ${location.pathname === '/saved' ? 'text-[#056839]' : 'text-slate-700'}`} fill={location.pathname === '/saved' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className={`text-[11px] ${location.pathname === '/saved' ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>Saved</span>
            {savedProductIds.length > 0 && (
              <span className="absolute top-1 right-[calc(50%-14px)] bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {savedProductIds.length}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to={profilePath}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 transition-colors"
          >
            <svg className={`w-6 h-6 ${isProfileActive ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className={`text-[11px] ${isProfileActive ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>Profile</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
