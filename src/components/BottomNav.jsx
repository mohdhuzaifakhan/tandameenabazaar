import { Home, LayoutGrid, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';

export default function BottomNav({ onOpenSearch }) {
  const location = useLocation();
  const { savedProductIds } = useBazaar();
  const { userProfile, currentUser } = useAuth();

  const profile = userProfile || currentUser;

  const profilePath = profile
    ? profile.role === 'admin'
      ? '/dashboard/admin'
      : profile.role === 'shop_owner'
        ? '/dashboard/shop'
        : '/dashboard/customer'
    : '/login';

  const isProfileActive =
    location.pathname === '/login' || location.pathname.startsWith('/dashboard');

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      active: location.pathname === '/',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/categories',
      onClick: onOpenSearch,
      active: location.pathname === '/search',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      path: '/categories',
      active: location.pathname === '/categories',
    },
    // {
    //   id: 'saved',
    //   label: 'Saved',
    //   icon: Heart,
    //   path: '/saved',
    //   badge: savedProductIds.length,
    //   active: location.pathname === '/saved',
    // },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: profilePath,
      active: isProfileActive,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100/90 md:hidden">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          const content = (
            <div className="flex flex-col items-center justify-center gap-0.5 relative py-1 px-3">
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${isActive ? 'text-[#056839] stroke-[2.4] scale-105' : 'text-slate-400 stroke-[1.8]'
                  }`}
                fill="none"
              />
              <span
                className={`text-[11px] tracking-tight transition-colors ${isActive ? 'text-[#056839] font-extrabold' : 'text-slate-500 font-medium'
                  }`}
              >
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="absolute -top-1 right-2 bg-[#056839] text-white font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
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
              onClick={(e) => {
                if (location.pathname === item.path) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {content}
            </Link>
          );
        })}
      </div>
      {/* iOS Home Bar Indicator */}
      <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto mb-1.5 opacity-80" />
    </nav>
  );
}
