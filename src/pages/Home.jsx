import React from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import ProductCard from '../components/ProductCard';
import ShopCardClean from '../components/ShopCardClean';

export default function Home() {
  const { categories, products, shops } = useBazaar();

  // Real products list (fall back to all products if no specific featured tag set)
  const featuredProducts = (products.filter(p => p.isFeatured).length > 0
    ? products.filter(p => p.isFeatured)
    : products).slice(0, 8);

  // Real shops list
  const popularShops = (shops.filter(s => s.rating >= 4.0).length > 0
    ? shops.filter(s => s.rating >= 4.0)
    : shops).slice(0, 4);

  return (
    <div className="w-full py-4 md:py-8 flex flex-col gap-8 md:gap-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-50 via-white to-teal-50/30 px-6 py-12 md:px-16 md:py-24 text-slate-800 border border-emerald-100/50 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full bg-teal-100/30 blur-3xl" />

        <div className="relative z-10 max-w-2xl flex flex-col gap-4 md:gap-6 text-center lg:text-left items-center lg:items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold tracking-wider uppercase w-fit text-emerald-800">
            <i className="fa-solid fa-sparkles text-[10px]"></i> Local Merchant Ecosystem
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-slate-900">
            Discover Verified <br />
            <span className="text-emerald-700">Boutiques &amp; Shops</span> <br />
            in Your City.
          </h1>
          
          <p className="text-xs md:text-sm text-slate-500 max-w-md font-medium leading-relaxed">
            Browse live storefronts from local sellers. Inquire directly and connect via WhatsApp.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 mt-2">
            <Link 
              to="/shops" 
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2 text-xs"
            >
              Explore Shops <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50 transition-all font-semibold text-xs"
            >
              Merchant &amp; Admin Sign In
            </Link>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block w-96 flex-shrink-0">
          <svg viewBox="0 0 450 300" className="w-full max-w-md">
            <rect x="180" y="50" width="220" height="200" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
            <path d="M 170 50 L 410 50 L 420 90 L 160 90 Z" fill="#056839" />
            <path d="M 195 50 L 225 50 L 220 90 L 190 90 Z" fill="#fef08a" />
            <path d="M 255 50 L 285 50 L 280 90 L 250 90 Z" fill="#fef08a" />
            <path d="M 315 50 L 345 50 L 340 90 L 310 90 Z" fill="#fef08a" />
            <path d="M 375 50 L 405 50 L 400 90 L 370 90 Z" fill="#fef08a" />
            <rect x="230" y="25" width="120" height="26" rx="4" fill="#034b28" />
            <text x="290" y="42" fontWeight="800" fontSize="11" fill="#ffffff" textAnchor="middle" letterSpacing="1">SHOP LOCAL</text>
            <rect x="260" y="140" width="60" height="110" rx="4" fill="#056839" opacity="0.15" stroke="#056839" strokeWidth="2" />
            <rect x="200" y="110" width="45" height="55" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
            <rect x="335" y="110" width="45" height="55" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-slate-100 bg-slate-50/50 rounded-2xl px-6">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-base"><i className="fa-solid fa-circle-check"></i></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Verified Stores</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Owner authenticated</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-base"><i className="fa-brands fa-whatsapp"></i></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Direct WhatsApp Lead</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Connect instantly with seller</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-base"><i className="fa-solid fa-sparkles"></i></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Direct Merchant Sales</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">No platform markup fees</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-base"><i className="fa-solid fa-truck-fast"></i></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Fast Local Pickups</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">In-city market shopping</p>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">Explore Categories</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Browse catalogs sorted by departments</p>
          </div>
          <Link to="/shops" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-5 lg:grid-cols-10 gap-3 overflow-x-auto pb-3 md:pb-0 scrollbar-none snap-x">
          {categories.slice(0, 10).map(cat => (
            <Link 
              key={cat.id} 
              to={`/shops?category=${cat.id}`} 
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50/10 transition-all text-center flex-shrink-0 w-[84px] md:w-auto snap-start group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-base text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all overflow-hidden border border-slate-100">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <i className={`fa-solid ${cat.icon || 'fa-tag'}`}></i>
                )}
              </div>
              <span className="text-[9px] font-bold text-slate-700 group-hover:text-emerald-600 transition-all line-clamp-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products (Real data only) */}
      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">Featured Products ({featuredProducts.length})</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Real products listed by local merchant stores</p>
          </div>
          {featuredProducts.length > 0 && (
            <Link to="/shops" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </Link>
          )}
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
            <i className="fa-solid fa-box-open text-3xl text-slate-300"></i>
            <h3 className="text-sm font-bold text-slate-800">No live products listed yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Are you a merchant? Sign in to your store dashboard to list your products and receive WhatsApp leads.
            </p>
            <Link to="/login" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl inline-block transition-colors">
              Merchant Login
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Shops (Real data only) */}
      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">Verified Local Storefronts ({popularShops.length})</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Merchant storefronts registered on Meena Bazaar</p>
          </div>
          {popularShops.length > 0 && (
            <Link to="/shops" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </Link>
          )}
        </div>

        {popularShops.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
            <i className="fa-solid fa-store-slash text-3xl text-slate-300"></i>
            <h3 className="text-sm font-bold text-slate-800">No merchant stores registered yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Set up your storefront today to manage your digital catalog and receive customer inquiries.
            </p>
            <Link to="/login" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl inline-block transition-colors">
              Register Storefront
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularShops.map(shop => (
              <ShopCardClean key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
