import { Link, useLocation } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { currentUser } = useBazaar();
  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path
    ? 'text-emerald-700 bg-emerald-50/50 font-bold border-l-4 border-emerald-600 pl-3.5'
    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-4';

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] transition-opacity duration-300"
      />

      {/* Drawer content box */}
      <div
        className="fixed top-0 bottom-0 left-0 w-72 bg-white z-[201] flex flex-col justify-between transition-transform duration-300 ease-out"
      >

        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-white flex items-center justify-center text-xs border border-emerald-900">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="flex flex-col leading-none">
              {/* <span className="text-[9px] text-slate-400 font-bold uppercase">Digital</span> */}
              <span className="text-xs font-black text-slate-900 mt-0.5">Meena Bazaar</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors border-none bg-transparent text-sm"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Drawer Body (Navigation Links) */}
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-1">
          <nav className="flex flex-col gap-1">
            <Link to="/" className={`flex items-center gap-3 py-2.5 text-xs font-bold transition-all ${isActive('/')}`} onClick={onClose}>
              <i className="fa-solid fa-house text-sm w-4 text-center"></i>
              <span>Home</span>
            </Link>
            <Link to="/shops" className={`flex items-center gap-3 py-2.5 text-xs font-bold transition-all ${isActive('/shops')}`} onClick={onClose}>
              <i className="fa-solid fa-store text-sm w-4 text-center"></i>
              <span>Shops Directory</span>
            </Link>
            <Link to="/saved" className={`flex items-center gap-3 py-2.5 text-xs font-bold transition-all ${isActive('/saved')}`} onClick={onClose}>
              <i className="fa-solid fa-heart text-sm w-4 text-center"></i>
              <span>Saved Products</span>
            </Link>
            <Link to="/about" className={`flex items-center gap-3 py-2.5 text-xs font-bold transition-all ${isActive('/about')}`} onClick={onClose}>
              <i className="fa-solid fa-circle-info text-sm w-4 text-center"></i>
              <span>About Us</span>
            </Link>
            <Link to="/contact" className={`flex items-center gap-3 py-2.5 text-xs font-bold transition-all ${isActive('/contact')}`} onClick={onClose}>
              <i className="fa-solid fa-phone text-sm w-4 text-center"></i>
              <span>Contact Us</span>
            </Link>
          </nav>

          <div className="h-px bg-slate-100 my-4 mx-5"></div>

          <nav className="flex flex-col gap-1">
            {currentUser && currentUser.role !== 'guest' ? (
              <Link
                to={currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
                className="flex items-center gap-3 py-2.5 pl-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all border-l-4 border-transparent"
                onClick={onClose}
              >
                <i className="fa-solid fa-gauge text-sm w-4 text-center text-emerald-600"></i>
                <span>{currentUser.role === 'admin' ? 'Admin Panel' : 'Shop Dashboard'}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-3 py-2.5 pl-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all border-l-4 border-transparent"
                  onClick={onClose}
                >
                  <i className="fa-regular fa-user text-sm w-4 text-center"></i>
                  <span>Shop Owner Portal</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-3 py-2.5 pl-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all border-l-4 border-transparent"
                  onClick={onClose}
                >
                  <i className="fa-solid fa-user-shield text-sm w-4 text-center"></i>
                  <span>Admin Dashboard</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center leading-normal font-semibold">
            &copy; 2026 Meena Bazaar<br />
            Powered by <strong className="text-slate-600 font-bold">UnifiedStack</strong>
          </p>
        </div>

      </div>
    </>
  );
}
