import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/defaultAssets';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { isProductSaved, toggleSaveProduct, openWhatsApp } = useBazaar();
  const navigate = useNavigate();
  const saved = isProductSaved(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProduct(product.id);
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsApp(product.id);
  };

  const imageUrl = (product.images && product.images.length > 0 ? product.images[0] : product.image) || DEFAULT_PRODUCT_IMAGE;

  return (
    <div 
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 transition-all duration-300 cursor-pointer p-3 flex flex-col justify-between h-full group"
    >
      <div>
        
        {/* Image Canvas with 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button Overlay */}
          <button 
            onClick={handleSaveClick}
            className={`absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white/90 flex items-center justify-center text-xs hover:scale-105 hover:bg-rose-50 transition-all cursor-pointer z-10 ${saved ? 'text-rose-500' : 'text-slate-400'}`}
            title="Save Product"
          >
            <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
          </button>

          {/* Product Image */}
          <img 
            src={imageUrl} 
            alt={product.name || 'Product'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Description Info Block */}
        <div className="mt-3 flex flex-col">
          {/* Merchant Shop Tag */}
          <span className="text-[10px] font-semibold text-slate-400 truncate">
            {product.shopName || 'Digital Hub'}
          </span>
          
          {/* Title */}
          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5 group-hover:text-[#056839] transition-colors">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-500">
            <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
            <span>{product.rating || '4.4'}</span>
            <span className="text-slate-400 font-medium">({product.reviewsCount || '78'})</span>
          </div>
        </div>

      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black text-slate-900">₹{product.price?.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="text-[10px] text-slate-400 line-through font-medium">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* WhatsApp Direct Order Button */}
        <button 
          onClick={handleWhatsAppClick}
          className="w-8 h-8 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white flex items-center justify-center text-xs transition-colors cursor-pointer border-none flex-shrink-0"
          title="Order on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i>
        </button>
      </div>

    </div>
  );
}
