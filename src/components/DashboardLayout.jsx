import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title, role }) {
  const { logout: bazaarLogout, orders, shops, products } = useBazaar();
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
  const shopOrdersCount = orders.filter(o => o.shopId === userShop?.id).length;
  const adminOrdersCount = orders.length;

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
                    <Link to="/dashboard/admin/orders" className={`flex items-center justify-between py-2.5 text-xs font-semibold rounded-lg transition-all pr-3 ${isActive('/dashboard/admin/orders')}`}>
                      <span className="flex items-center gap-3">
                        <i className="fa-regular fa-comment-dots text-sm w-4 text-center"></i>
                        <span>Customer Leads</span>
                      </span>
                      <span className="bg-emerald-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full">{adminOrdersCount}</span>
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
                    <Link to="/dashboard/shop" className="flex items-center justify-between py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4 pr-3">
                      <span className="flex items-center gap-3">
                        <i className="fa-regular fa-comment-dots text-sm w-4 text-center"></i>
                        <span>WhatsApp Leads</span>
                      </span>
                      <span className="bg-emerald-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full">{shopOrdersCount}</span>
                    </Link>
                  </li>
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
            <h4 className="text-white font-bold text-xs">Need Support?</h4>
            <p className="text-[10px] text-emerald-300 leading-normal">Reach out to Unifiedstack technical support channels.</p>
            <a
              href="mailto:mohdhuzaifa8126195456@gmail.com"
              className="mt-2 w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] text-center block transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Display Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header Bar (Rich Deep Green Styling matching reference design) */}
        <header className="sticky top-0 z-30 h-16 bg-[#056839] text-white px-4 md:px-6 flex items-center justify-between gap-3 shadow-md">

          {/* Left: Hamburger + Brand Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10 flex-shrink-0"
              aria-label="Toggle Sidebar Navigation"
            >
              <i className="fa-solid fa-bars text-base"></i>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white text-[#056839] flex items-center justify-center text-sm font-bold shadow-xs flex-shrink-0">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-wider">Digital</span>
                <span className="text-xs sm:text-sm font-black text-white truncate">Meena Bazaar</span>
              </div>
            </div>
          </div>

          {/* Right: Notification Bell + Avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notifications with counter badge */}
            <Link 
              to={role === 'admin' ? "/dashboard/admin/orders" : "/dashboard/shop"} 
              className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors border border-white/10"
              title="View Customer Leads"
            >
              <i className="fa-regular fa-bell text-sm"></i>
              {adminOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {role === 'admin' ? adminOrdersCount : shopOrdersCount}
                </span>
              )}
            </Link>

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

      {/* 3. Mobile Bottom Navigation Bar (Matching exact design image for mobile screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-[10px] font-bold text-slate-500 lg:hidden shadow-lg">
        {/* Dashboard Link */}
        <Link 
          to={role === 'admin' ? "/dashboard/admin" : "/dashboard/shop"} 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isBottomNavActive(role === 'admin' ? '/dashboard/admin' : '/dashboard/shop') 
              ? 'text-[#056839] font-black' 
              : 'hover:text-slate-900'
          }`}
        >
          <i className={`text-base ${isBottomNavActive(role === 'admin' ? '/dashboard/admin' : '/dashboard/shop') ? 'fa-solid fa-house text-[#056839]' : 'fa-solid fa-house text-slate-400'}`}></i>
          <span>Dashboard</span>
        </Link>

        {/* Shops Link */}
        <Link 
          to="/dashboard/admin/shops" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isBottomNavActive('/dashboard/admin/shops') 
              ? 'text-[#056839] font-black' 
              : 'hover:text-slate-900'
          }`}
        >
          <i className={`text-base ${isBottomNavActive('/dashboard/admin/shops') ? 'fa-solid fa-store text-[#056839]' : 'fa-solid fa-store text-slate-400'}`}></i>
          <span>Shops</span>
        </Link>

        {/* Products (Storefront Link) */}
        <Link 
          to="/shops" 
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all hover:text-slate-900"
        >
          <i className="fa-solid fa-box text-base text-slate-400"></i>
          <span>Products</span>
        </Link>

        {/* Orders Link with real dynamic badge */}
        <Link 
          to="/dashboard/admin/orders" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
            isBottomNavActive('/dashboard/admin/orders') 
              ? 'text-[#056839] font-black' 
              : 'hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <i className={`text-base ${isBottomNavActive('/dashboard/admin/orders') ? 'fa-solid fa-bag-shopping text-[#056839]' : 'fa-solid fa-bag-shopping text-slate-400'}`}></i>
            {adminOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-3.5 bg-[#056839] text-white font-extrabold text-[8px] px-1.5 py-0.2 rounded-full">
                {adminOrdersCount}
              </span>
            )}
          </div>
          <span>Orders</span>
        </Link>

        {/* More Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <i className="fa-solid fa-ellipsis text-base text-slate-400"></i>
          <span>More</span>
        </button>
      </nav>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs lg:hidden z-40"
        />
      )}

    </div>
  );
}
