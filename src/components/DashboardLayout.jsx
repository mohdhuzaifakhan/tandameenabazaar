import {
  Eye,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  Tags,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';

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

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-emerald-900/40 text-white font-bold border-l-4 border-emerald-500 pl-3.5'
      : 'text-emerald-100 hover:bg-emerald-900/20 hover:text-white border-l-4 border-transparent pl-4';

  const isBottomNavActive = (path) => location.pathname === path;

  // Find logged in merchant shop
  const userShop = shops.find(
    (s) =>
      (userProfile?.uid && s.ownerUid === userProfile.uid) ||
      (userProfile?.shopId && s.id === userProfile.shopId) ||
      (userProfile?.email && s.ownerEmail && s.ownerEmail.toLowerCase() === userProfile.email.toLowerCase())
  );

  // Mobile Bottom Navigation Items configuration
  const adminNavItems = [
    { id: 'dash', label: 'Overview', icon: LayoutDashboard, path: '/dashboard/admin' },
    { id: 'shops', label: 'Shops', icon: Store, path: '/dashboard/admin/shops' },
    { id: 'cat', label: 'Categories', icon: Tags, path: '/dashboard/admin/categories' },
    { id: 'public', label: 'Storefront', icon: Eye, path: '/shops' },
    { id: 'menu', label: 'Menu', icon: Menu, onClick: () => setSidebarOpen(true) },
  ];

  const merchantNavItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/shop' },
    {
      id: 'live',
      label: 'Live Store',
      icon: Store,
      path: userShop ? `/shop/${userShop.id}` : '/shops',
    },
    { id: 'storefront', label: 'Storefront', icon: ShoppingBag, path: '/shops' },
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'menu', label: 'Menu', icon: Menu, onClick: () => setSidebarOpen(true) },
  ];

  const bottomNavItems = role === 'admin' ? adminNavItems : merchantNavItems;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-800">

      {/* 1. Sidebar Navigation (Left Panel) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-emerald-950 text-slate-200 flex flex-col justify-between z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          {/* Logo Brand Area */}
          <div className="p-5 border-b border-emerald-900/45 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#056839] flex items-center justify-center text-base font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5 text-[#056839] stroke-[2.2]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-extrabold text-white mt-0.5 tracking-tight">
                Meena Bazaar
              </span>
              {role === 'admin' && (
                <span className="text-[8px] text-emerald-400 font-extrabold tracking-widest mt-1 uppercase font-sans">
                  ADMIN PANEL
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5 mt-2">
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {role === 'admin' ? (
                <>
                  <li>
                    <Link
                      to="/dashboard/admin"
                      className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive(
                        '/dashboard/admin'
                      )}`}
                    >
                      <TrendingUp className="w-4 h-4 text-center" />
                      <span>Dashboard Overview</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/admin/shops"
                      className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive(
                        '/dashboard/admin/shops'
                      )}`}
                    >
                      <Store className="w-4 h-4 text-center" />
                      <span>Shops Directory</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/admin/categories"
                      className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive(
                        '/dashboard/admin/categories'
                      )}`}
                    >
                      <Tags className="w-4 h-4 text-center" />
                      <span>Categories &amp; Locations</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shops"
                      className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4"
                    >
                      <Eye className="w-4 h-4 text-center" />
                      <span>Public Storefront</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/dashboard/shop"
                      className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive(
                        '/dashboard/shop'
                      )}`}
                    >
                      <TrendingUp className="w-4 h-4 text-center" />
                      <span>Merchant Dashboard</span>
                    </Link>
                  </li>
                  {userShop && (
                    <li>
                      <Link
                        to={`/shop/${userShop.id}`}
                        target="_blank"
                        className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4"
                      >
                        <Store className="w-4 h-4 text-center" />
                        <span>View Live Storefront</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4"
                    >
                      <Home className="w-4 h-4 text-center" />
                      <span>Home Storefront</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Logout button */}
              <li className="mt-6 pt-4 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 py-2.5 pl-4 text-xs font-bold text-red-300 hover:bg-red-950/30 hover:text-red-200 rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <LogOut className="w-4 h-4 text-center" />
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
            <p className="text-[10px] text-emerald-300 leading-normal">
              All customer orders and inquiries connect directly to merchant WhatsApp numbers.
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Display Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-emerald-950 text-white px-4 md:px-6 flex items-center justify-between gap-3 shadow-md border-b border-emerald-900/40">

          {/* Left: Hamburger (mobile only) + Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10 flex-shrink-0 lg:hidden"
              aria-label="Toggle Sidebar Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white text-[#056839] flex items-center justify-center text-sm font-bold shadow-xs flex-shrink-0 lg:hidden">
                <ShoppingBag className="w-4 h-4 text-[#056839]" />
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
            {/* <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-400/30 transition-colors"
              title="Orders handled directly on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Channel</span>
            </a> */}

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
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar for Dashboards (Identical Aesthetic to App BottomNav) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isBottomNavActive(item.path);

            const content = (
              <div className="flex flex-col items-center justify-center gap-1 relative py-1 px-1 min-w-0 w-full text-center">
                <Icon
                  className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${isActive ? 'text-[#056839] stroke-[2.4] scale-105' : 'text-slate-400 stroke-[1.8]'
                    }`}
                  fill="none"
                />
                <span
                  className={`text-[10px] tracking-tight transition-colors whitespace-nowrap truncate max-w-full block leading-none ${isActive ? 'text-[#056839] font-extrabold' : 'text-slate-500 font-medium'
                    }`}
                >
                  {item.label}
                </span>
              </div>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="flex-1 flex justify-center items-center h-full cursor-pointer bg-transparent border-none"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex-1 flex justify-center items-center h-full"
              >
                {content}
              </Link>
            );
          })}
        </div>
        {/* iOS Home Bar Indicator */}
        <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto mb-1.5 opacity-80" />
      </nav>

      {/* Mobile Backdrop for Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs lg:hidden z-40"
        />
      )}
    </div>
  );
}
