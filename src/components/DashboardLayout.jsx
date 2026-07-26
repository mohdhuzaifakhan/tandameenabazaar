import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title, role }) {
  const { logout: bazaarLogout, shops } = useBazaar();
  const { userProfile, logout: authLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authLogout();
    bazaarLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path
    ? 'bg-emerald-900/40 text-white font-bold border-l-4 border-emerald-500 pl-3.5'
    : 'text-emerald-100 hover:bg-emerald-900/20 hover:text-white border-l-4 border-transparent pl-4';

  const isBottomNavActive = (path) => location.pathname === path;

  // Find logged in merchant shop
  const userShop = shops.find(s => s.ownerUid === userProfile?.uid || s.id === userProfile?.shopId) || shops[0];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-800">

      {/* 1. Sidebar Navigation (Left Panel) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-emerald-950 text-slate-200 flex flex-col justify-between z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Brand Area */}
          <div className="p-5 border-b border-emerald-900/45 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#056839] flex items-center justify-center text-base font-bold shadow-xs">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Digital</span>
              <span className="text-sm font-black text-white mt-0.5">Meena Bazaar</span>
              {role === 'admin' && (
                <span className="text-[7px] text-emerald-400 font-extrabold tracking-widest mt-1 uppercase">ADMIN PANEL</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5 mt-2">
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {role === 'admin' ? (
                <>
                  <li>
                    <Link to="/dashboard/admin" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/admin')}`}>
                      <i className="fa-solid fa-chart-line text-sm w-4 text-center"></i>
                      <span>Dashboard Overview</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/admin/shops" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/admin/shops')}`}>
                      <i className="fa-solid fa-store text-sm w-4 text-center"></i>
                      <span>Shops Directory</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/admin/categories')}`}>
                      <i className="fa-solid fa-tags text-sm w-4 text-center"></i>
                      <span>Categories &amp; Locations</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shops" className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-eye text-sm w-4 text-center"></i>
                      <span>Public Storefront</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/dashboard/shop" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/shop')}`}>
                      <i className="fa-solid fa-chart-line text-sm w-4 text-center"></i>
                      <span>Merchant Dashboard</span>
                    </Link>
                  </li>
                  {userShop && (
                    <li>
                      <Link to={`/shop/${userShop.id}`} target="_blank" className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                        <i className="fa-solid fa-store text-sm w-4 text-center"></i>
                        <span>View Live Storefront</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/" className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-house text-sm w-4 text-center"></i>
                      <span>Home Storefront</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Logout button */}
              <li className="mt-6 pt-4 border-t border-emerald-900/40">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 py-2.5 pl-4 text-xs font-bold text-red-300 hover:bg-red-950/30 hover:text-red-200 rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <i className="fa-solid fa-right-from-bracket text-sm w-4 text-center"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Help Card */}
        <div className="p-4">
          <div className="p-4 bg-emerald-900/20 border border-emerald-900/40 rounded-2xl flex flex-col gap-2">
            <h4 className="text-white font-bold text-xs">Direct WhatsApp Channel</h4>
            <p className="text-[10px] text-emerald-300 leading-normal">All customer orders and inquiries connect directly to merchant WhatsApp numbers.</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Display Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header Bar (Matching Sidebar Theme) */}
        <header className="sticky top-0 z-30 h-16 bg-emerald-950 text-white px-4 md:px-6 flex items-center justify-between gap-3 shadow-md border-b border-emerald-900/40">

          {/* Left: Hamburger (mobile only) + Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10 flex-shrink-0 lg:hidden"
              aria-label="Toggle Sidebar Navigation"
            >
              <i className="fa-solid fa-bars text-base"></i>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white text-[#056839] flex items-center justify-center text-sm font-bold shadow-xs flex-shrink-0 lg:hidden">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-wider">
                  {role === 'admin' ? 'Admin Panel' : 'Merchant Portal'}
                </span>
                <h1 className="text-xs sm:text-base font-black text-white truncate">
                  {title || (role === 'admin' ? 'Admin Dashboard' : 'Merchant Dashboard')}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: WhatsApp Channel Badge + Avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-400/30 transition-colors"
              title="Orders handled directly on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-sm text-[#25D366]"></i>
              <span className="hidden sm:inline">WhatsApp Channel</span>
            </a>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName || 'User'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs border-2 border-emerald-400 shadow-sm flex-shrink-0">
                  {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'A'}
                </div>
              )}
            </div>
          </div>

        </header>

        {/* Display Content Wrapper */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 pb-24 lg:pb-6">
          {children}
        </main>

      </div>

      {/* 3. Mobile Bottom Navigation Bar (Ultra-Thin Minimal Line Icons) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 py-2 px-1 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)] safe-area-bottom">
        <Link 
          to={role === 'admin' ? "/dashboard/admin" : "/dashboard/shop"} 
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
        >
          {isBottomNavActive(role === 'admin' ? '/dashboard/admin' : '/dashboard/shop') ? (
            <svg className="w-6 h-6 text-[#056839]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" />
              <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
            </svg>
          )}
          <span className={`text-[11px] ${isBottomNavActive(role === 'admin' ? '/dashboard/admin' : '/dashboard/shop') ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>
            Dashboard
          </span>
        </Link>

        {role === 'admin' ? (
          <>
            <Link 
              to="/dashboard/admin/shops" 
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
            >
              <svg className={`w-6 h-6 ${isBottomNavActive('/dashboard/admin/shops') ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H21m-9 0H3m18 0h-3m0 0h-3m0 0H9m-6 0h3m2.25-18h8.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75z" />
              </svg>
              <span className={`text-[11px] ${isBottomNavActive('/dashboard/admin/shops') ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>
                Shops
              </span>
            </Link>

            <Link 
              to="/dashboard/admin/categories" 
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
            >
              <svg className={`w-6 h-6 ${isBottomNavActive('/dashboard/admin/categories') ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span className={`text-[11px] ${isBottomNavActive('/dashboard/admin/categories') ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>
                Taxonomy
              </span>
            </Link>
          </>
        ) : (
          <Link 
            to="/shops" 
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
          >
            <svg className={`w-6 h-6 ${isBottomNavActive('/shops') ? 'text-[#056839]' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H21m-9 0H3m18 0h-3m0 0h-3m0 0H9m-6 0h3m2.25-18h8.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75z" />
            </svg>
            <span className={`text-[11px] ${isBottomNavActive('/shops') ? 'text-[#056839] font-bold' : 'text-slate-700 font-medium'}`}>
              Stores
            </span>
          </Link>
        )}

        <Link 
          to="/" 
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
          </svg>
          <span className="text-[11px] text-slate-700 font-medium">Public App</span>
        </Link>

        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors cursor-pointer border-none bg-transparent"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span className="text-[11px] text-slate-700 font-medium">Menu</span>
        </button>
      </nav>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs lg:hidden z-40"
        />
      )}

    </div>
  );
}
