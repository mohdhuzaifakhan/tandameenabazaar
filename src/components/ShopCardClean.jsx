import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopCardClean({ shop }) {
  return (
    <Link 
      to={`/shop/${shop.id}`} 
      className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-slate-100 transition-all group"
    >
      <div className="flex items-center gap-4">
        {/* Logo thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0">
          <img 
            src={shop.logoImage} 
            alt={shop.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <h4 className="text-xs font-black text-slate-900 line-clamp-1">{shop.name}</h4>
            {shop.verified && <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]" title="Verified Seller"></i>}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">{shop.market}, Rampur</span>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold mt-0.5">
            <span className="flex items-center gap-0.5"><i className="fa-solid fa-star text-amber-500"></i> {shop.rating}</span>
            <span>&bull;</span>
            <span className="text-emerald-600">{shop.productsCount || 100}+ Products</span>
          </div>
        </div>
      </div>
      
      <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 flex items-center justify-center text-xs transition-colors">
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </Link>
  );
}
