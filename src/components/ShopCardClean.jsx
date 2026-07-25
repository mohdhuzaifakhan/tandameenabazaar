import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShopCardClean({ shop }) {
  const navigate = useNavigate();
  const logo = shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80';

  const handleCardClick = () => {
    if (shop?.id) {
      navigate(`/shop/${shop.id}`);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full"
    >
      
      {/* Store Cover Banner & Rating Badge */}
      <div className="relative h-28 bg-slate-100 overflow-hidden">
        <img 
          src={logo} 
          alt={shop.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Rating Pill Top Right */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 text-slate-900 font-extrabold text-[10px] flex items-center gap-1">
          <i className="fa-solid fa-star text-amber-400 text-[9px]"></i> {shop.rating || 4.9}
        </span>
      </div>

      {/* Store Info & WhatsApp CTA */}
      <div className="p-3.5 flex items-center justify-between gap-3 flex-1">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-[#056839] transition-colors">{shop.name}</h4>
          <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">{shop.market || 'Civil Lines'}</span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">★ {shop.rating || 4.9}</span>
        </div>

        {/* WhatsApp Icon Button matching mockup */}
        <a
          href={`https://wa.me/${(shop.whatsapp || shop.phone || '').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={handleWhatsAppClick}
          className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          title="Contact Store on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i>
        </a>
      </div>

    </div>
  );
}
