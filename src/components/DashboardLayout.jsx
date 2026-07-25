import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function DashboardLayout({ children, title, role }) {
  const { logout, orders, shops, products } = useBazaar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path
    ? 'bg-emerald-900/40 text-white font-bold border-l-4 border-emerald-500 pl-3.5'
    : 'text-emerald-100 hover:bg-emerald-900/20 hover:text-white border-l-4 border-transparent pl-4';

  const shopOrdersCount = 23;
  const adminOrdersCount = 356;

  return (
    <div className="min-h-screen flex bg-slate-50/50 font-sans text-slate-800">

      {/* 1. Sidebar Navigation (Left Panel) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-emerald-950 text-slate-200 flex flex-col justify-between z-40 transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Brand Area */}
          <div className="p-5 border-b border-emerald-900/45 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white text-emerald-900 flex items-center justify-center text-base font-bold">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="flex flex-col leading-none">
              {/* <span className="text-[10px] text-emerald-450 font-bold uppercase tracking-wider">Digital</span> */}
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
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/admin/shops" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/admin/shops')}`}>
                      <i className="fa-solid fa-store text-sm w-4 text-center"></i>
                      <span>Shops Directory</span>
                    </Link>
                  </li>
                  <li>
                    <a href="#products" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-box text-sm w-4 text-center"></i>
                      <span>Products</span>
                    </a>
                  </li>
                  <li>
                    <a href="#categories" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-layer-group text-sm w-4 text-center"></i>
                      <span>Categories</span>
                    </a>
                  </li>
                  <li>
                    <a href="#users" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-users text-sm w-4 text-center"></i>
                      <span>Users</span>
                    </a>
                  </li>
                  <li>
                    <Link to="/dashboard/admin/orders" className={`flex items-center justify-between py-2.5 text-xs font-semibold rounded-lg transition-all pr-3 ${isActive('/dashboard/admin/orders')}`}>
                      <span className="flex items-center gap-3">
                        <i className="fa-regular fa-comment-dots text-sm w-4 text-center"></i>
                        <span>Orders (Leads)</span>
                      </span>
                      <span className="bg-emerald-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full">{adminOrdersCount}</span>
                    </Link>
                  </li>
                  <li>
                    <a href="#settings" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-gear text-sm w-4 text-center"></i>
                      <span>Settings</span>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/dashboard/shop" className={`flex items-center gap-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive('/dashboard/shop')}`}>
                      <i className="fa-solid fa-chart-line text-sm w-4 text-center"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop/sharma-mobile" className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-store text-sm w-4 text-center"></i>
                      <span>My Shop</span>
                    </Link>
                  </li>
                  <li>
                    <a href="#products" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-box text-sm w-4 text-center"></i>
                      <span>Products</span>
                    </a>
                  </li>
                  <li>
                    <a href="#orders" onClick={e => e.preventDefault()} className="flex items-center justify-between py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4 pr-3">
                      <span className="flex items-center gap-3">
                        <i className="fa-regular fa-comment-dots text-sm w-4 text-center"></i>
                        <span>Orders (Leads)</span>
                      </span>
                      <span className="bg-emerald-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full">{shopOrdersCount}</span>
                    </a>
                  </li>
                  <li>
                    <a href="#settings" onClick={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-900/20 hover:text-white rounded-lg transition-all pl-4">
                      <i className="fa-solid fa-gear text-sm w-4 text-center"></i>
                      <span>Settings</span>
                    </a>
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
            <p className="text-[10px] text-emerald-350 leading-normal">Reach out to Unifiedstack technical support channels.</p>
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

        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 h-13 bg-white border-b border-slate-100 px-4 md:px-6 flex items-center justify-between gap-3">

          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer border border-slate-200 flex-shrink-0"
            >
              <i className="fa-solid fa-bars text-sm"></i>
            </button>

            {role === 'admin' ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider border border-slate-200 flex-shrink-0">Admin</span>
                <span className="text-xs text-slate-400 font-semibold hidden md:inline truncate">Platform Administrator</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs min-w-0">
                <strong className="text-slate-800 font-black truncate">Sharma Mobile</strong>
                <i className="fa-solid fa-circle-check text-emerald-600 text-[10px] flex-shrink-0"></i>
                <span className="text-slate-400 font-medium hidden md:inline truncate">&bull; Gandhi Market</span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Storefront */}
            <Link
              to="/"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
              title="View Storefront"
            >
              <i className="fa-solid fa-house text-xs"></i>
            </Link>

            {/* Notifications */}
            <div className="relative w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer">
              <i className="fa-regular fa-bell text-xs"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {role === 'admin' ? 5 : 3}
              </span>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80"
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="hidden lg:flex flex-col text-[11px] leading-tight">
                <span className="font-bold text-slate-800">{role === 'admin' ? 'Admin' : 'Mohd. Shadab'}</span>
                <span className="text-slate-400">{role === 'admin' ? 'Administrator' : 'Store Manager'}</span>
              </div>
            </div>
          </div>

        </header>

        {/* Display Wrapper */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs lg:hidden z-30"
        />
      )}

    </div>
  );
}
