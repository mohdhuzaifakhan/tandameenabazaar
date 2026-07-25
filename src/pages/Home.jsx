import React from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import ProductCard from '../components/ProductCard';
import ShopCardClean from '../components/ShopCardClean';

export default function Home() {
  const { categories, products, shops } = useBazaar();

  // Real products list
  const featuredProducts = (products.filter(p => p.isFeatured).length > 0
    ? products.filter(p => p.isFeatured)
    : products).slice(0, 8);

  // Real shops list
  const popularShops = (shops.filter(s => s.rating >= 4.0).length > 0
    ? shops.filter(s => s.rating >= 4.0)
    : shops).slice(0, 5);

  // Category Icon Colors Map matching mockup
  const categoryColors = [
    { bg: 'bg-emerald-100 text-[#056839]', count: '124 Shops' },
    { bg: 'bg-orange-100 text-orange-600', count: '220 Shops' },
    { bg: 'bg-emerald-100 text-emerald-700', count: '180 Shops' },
    { bg: 'bg-rose-100 text-rose-600', count: '95 Shops' },
    { bg: 'bg-pink-100 text-pink-600', count: '110 Shops' },
    { bg: 'bg-amber-100 text-amber-600', count: '85 Shops' },
    { bg: 'bg-teal-100 text-teal-600', count: '60 Shops' },
    { bg: 'bg-purple-100 text-purple-600', count: '45 Shops' },
    { bg: 'bg-slate-100 text-slate-600', count: 'More' }
  ];

  return (
    <div className="w-full py-4 md:py-6 flex flex-col gap-8 md:gap-12 animate-fade-in">
      
      {/* Hero Section matching reference design */}
      <section className="relative overflow-hidden rounded-3xl bg-[#f0fdf4] px-6 py-8 md:px-12 md:py-16 text-slate-800 border border-emerald-100/70 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="relative z-10 max-w-xl flex flex-col gap-4 text-center lg:text-left items-center lg:items-start">
          
          {/* Green Top Pill Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-[#056839] text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#056839] inline-block animate-pulse"></span> LOCAL &bull; VERIFIED &bull; TRUSTED
          </span>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-slate-900">
            Discover the Best <br />
            <span className="text-[#056839]">Shops &amp; Products</span> <br />
            in Your City
          </h1>
          
          <p className="text-xs md:text-sm text-slate-600 max-w-md font-medium leading-relaxed">
            Verified local shops. Direct WhatsApp. Fast &amp; easy.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-1 w-full">
            <Link 
              to="/shops" 
              className="px-6 py-3 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-bold transition-all flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
            >
              Explore Shops <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          {/* Stats Bar Strip matching mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-200/50 mt-2 w-full text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#056839] flex items-center justify-center text-xs flex-shrink-0">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div className="leading-tight">
                <strong className="text-xs font-black text-slate-900 block">1,500+</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Products</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#056839] flex items-center justify-center text-xs flex-shrink-0">
                <i className="fa-solid fa-store"></i>
              </div>
              <div className="leading-tight">
                <strong className="text-xs font-black text-slate-900 block">200+</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Shops</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#056839] flex items-center justify-center text-xs flex-shrink-0">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div className="leading-tight">
                <strong className="text-xs font-black text-slate-900 block">15+</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Categories</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#056839] flex items-center justify-center text-xs flex-shrink-0">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <div className="leading-tight">
                <strong className="text-xs font-black text-slate-900 block">100%</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Local</span>
              </div>
            </div>
          </div>

        </div>

        {/* Storefront Illustration matching reference image graphics */}
        <div className="relative z-10 hidden lg:flex items-center justify-center w-[400px] flex-shrink-0">
          <div className="relative w-full aspect-[4/3] bg-white rounded-3xl border border-slate-100 p-4 flex items-center justify-center">
            {/* Store Graphic Canvas */}
            <svg viewBox="0 0 400 280" className="w-full h-full">
              {/* Store Awning */}
              <rect x="80" y="40" width="240" height="180" rx="16" fill="#1e293b" />
              <path d="M 70,40 L 330,40 L 340,75 L 60,75 Z" fill="#056839" />
              <path d="M 90,40 L 120,40 L 115,75 L 85,75 Z" fill="#ffffff" />
              <path d="M 150,40 L 180,40 L 175,75 L 145,75 Z" fill="#ffffff" />
              <path d="M 210,40 L 240,40 L 235,75 L 205,75 Z" fill="#ffffff" />
              <path d="M 270,40 L 300,40 L 295,75 L 265,75 Z" fill="#ffffff" />
              
              {/* Store Display Window */}
              <rect x="110" y="90" width="180" height="110" rx="8" fill="#0f172a" />
              <circle cx="200" cy="140" r="30" fill="#056839" opacity="0.3" />
            </svg>

            {/* Floating Verified Hub Badge */}
            <div className="absolute bottom-6 left-12 bg-white/95 backdrop-blur-xs border border-slate-100 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-slate-800">
              <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              <span>Verified Hub &bull; Trusted</span>
            </div>
          </div>
        </div>

      </section>

      {/* 1. Nearby Stores Section */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug truncate">Nearby Stores</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Top rated shops near you</p>
          </div>
          <Link to="/shops" className="text-xs font-extrabold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
            <span>View All</span> <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-3 md:pb-0 scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {popularShops.map(shop => (
            <div key={shop.id} className="w-[240px] sm:w-[260px] md:w-auto flex-shrink-0 snap-start">
              <ShopCardClean shop={shop} />
            </div>
          ))}
        </div>
      </section>

      {/* 2. Shop by Categories Section */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug truncate">Shop by Categories</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Explore top categories</p>
          </div>
          <Link to="/shops" className="text-xs font-extrabold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
            <span className="hidden sm:inline">View All Categories</span>
            <span className="sm:hidden">View All</span>
            <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-5 lg:grid-cols-9 gap-3 overflow-x-auto pb-3 md:pb-0 scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {categories.slice(0, 9).map((cat, idx) => {
            const color = categoryColors[idx % categoryColors.length];

            return (
              <Link 
                key={cat.id} 
                to={`/shops?category=${cat.id}`} 
                className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 transition-all text-center group flex-shrink-0 w-[96px] md:w-auto snap-start"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${color.bg} transition-transform group-hover:scale-110 flex-shrink-0`}>
                  <i className={`fa-solid ${cat.icon || 'fa-tag'}`}></i>
                </div>
                <div className="flex flex-col leading-none w-full min-w-0">
                  <span className="text-xs font-black text-slate-800 group-hover:text-[#056839] transition-colors truncate block">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 truncate block">{color.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug truncate">Featured Products</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Handpicked products from trusted local shops</p>
          </div>
          <Link to="/shops" className="text-xs font-extrabold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
            <span className="hidden sm:inline">View All Products</span>
            <span className="sm:hidden">View All</span>
            <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
            <i className="fa-solid fa-box-open text-3xl text-slate-300"></i>
            <h3 className="text-sm font-bold text-slate-800">No live products listed yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Are you a merchant? Sign in to your store dashboard to list your products and receive WhatsApp leads.
            </p>
            <Link to="/login" className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-block transition-colors">
              Merchant Login
            </Link>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto pb-3 md:pb-0 scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0">
            {featuredProducts.map(prod => (
              <div key={prod.id} className="w-[200px] sm:w-[240px] md:w-auto flex-shrink-0 snap-start">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
