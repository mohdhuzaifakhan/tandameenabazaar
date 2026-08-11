import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { matchProductSearch, matchShopSearch } from '../utils/searchUtils';
import BottomNav from './BottomNav';

export default function Footer({ onOpenDrawer }) {
  const { products, shops, savedProductIds } = useBazaar();
  const { userProfile, currentUser } = useAuth();
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
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSelectResult = (url) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(url);
  };

  const matchingProducts = searchQuery.trim()
    ? products.filter(p => matchProductSearch(p, searchQuery)).slice(0, 4)
    : [];

  const matchingShops = searchQuery.trim()
    ? shops.filter(s => matchShopSearch(s, searchQuery)).slice(0, 3)
    : [];

  const profile = userProfile || currentUser;

  const profilePath = profile
    ? profile.role === 'admin'
      ? '/dashboard/admin'
      : profile.role === 'shop_owner'
        ? '/dashboard/shop'
        : '/dashboard/customer'
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
                href="https://wa.me/918433043426?text=Hello Unifiedstack, I have a query about Meena Bazaar."
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
          <span>&copy; 2026 Meena Bazaar. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by <strong className="text-slate-700">Unifiedstack</strong> Solutions
          </span>
        </div>
      </footer>

      {/* ── Mobile Footer (simple copyright only) ── */}
      <footer className="md:hidden w-full border-t border-slate-100 bg-slate-50 py-4 px-4 pb-24 text-center text-[10px] text-slate-400 font-semibold">
        &copy; 2026 Meena Bazaar &bull; Developed by <strong className="text-slate-600">Unifiedstack</strong>
      </footer>

      {/* ── Mobile Search Overlay ── */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex flex-col">
          {/* Search panel slides up from top */}
          <div className="bg-white px-4 pt-10 pb-5 flex flex-col gap-3 max-h-[85vh] rounded-b-3xl shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-black text-slate-900">Search Meena Bazaar</span>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer border-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
              <input
                autoFocus
                type="text"
                placeholder="Search stores, products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#056839] bg-slate-50 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer border-none bg-transparent p-1"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              )}
            </form>

            {/* Live Instant Search Results */}
            {searchQuery.trim() ? (
              <div className="space-y-3 pt-1">
                {matchingProducts.length === 0 && matchingShops.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 font-semibold text-xs space-y-2">
                    <p>No results found for "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="px-4 py-2 rounded-xl bg-[#056839] text-white text-xs font-bold border-none"
                    >
                      Search All Categories
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Matching Shops */}
                    {matchingShops.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-[#056839]" /> Stores ({matchingShops.length})
                        </div>
                        <div className="space-y-1">
                          {matchingShops.map(s => (
                            <div
                              key={s.id}
                              onClick={() => handleSelectResult(`/shop/${s.id}`)}
                              className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors border border-slate-100"
                            >
                              <img src={s.image} alt={s.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black text-slate-900 truncate">{s.name}</h4>
                                <span className="text-[11px] text-slate-500 font-semibold block truncate">{s.market || s.city}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products */}
                    {matchingProducts.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-[#056839]" /> Products ({matchingProducts.length})
                        </div>
                        <div className="space-y-1">
                          {matchingProducts.map(p => (
                            <div
                              key={p.id}
                              onClick={() => handleSelectResult(`/categories?search=${encodeURIComponent(p.name)}`)}
                              className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors border border-slate-100"
                            >
                              <img src={p.image || (p.images && p.images[0])} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-extrabold text-slate-900 truncate">{p.name}</h4>
                                <span className="text-[11px] text-emerald-800 font-black block">₹{Number(p.price).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs text-center transition-all shadow-md cursor-pointer border-none"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Quick navigation suggestions when query is empty */
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Popular Searches</span>
                <div className="flex flex-wrap gap-2">
                  {['Mobile', 'Fashion', 'Electronics', 'Footwear', 'Groceries'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectResult(`/categories?search=${tag}`)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer border border-slate-200/60"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Tap backdrop to close */}
          <div className="flex-1" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
        </div>
      )}

      {/* ── Public Mobile Bottom Nav Bar (Lucide React Icons) ── */}
      <BottomNav onOpenSearch={() => setSearchOpen(true)} />
    </>
  );
}
