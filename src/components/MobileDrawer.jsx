import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { userProfile, logout } = useAuth();
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

          {/* User Profile Banner if logged in */}
          {userProfile && (
            <div className="mx-4 mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-xs text-slate-900 block truncate">{userProfile.displayName}</span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">{userProfile.role || 'Merchant'}</span>
              </div>
            </div>
          )}

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

          {/* Merchant / Dashboard Actions */}
          <div className="px-4 space-y-2">
            {userProfile ? (
              <>
                <Link
                  to={userProfile.role === 'admin' ? '/dashboard/admin' : '/dashboard/shop'}
                  className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                  onClick={onClose}
                >
                  <i className="fa-solid fa-store"></i>
                  <span>{userProfile.role === 'admin' ? 'Admin Panel' : 'My Shop Dashboard'}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-rose-100 mt-2"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                onClick={onClose}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Login / Register Shop</span>
              </Link>
            )}
          </div>

        </div>

      </div>
    </>
  );
}
