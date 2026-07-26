import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/defaultAssets';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { isProductSaved, toggleSaveProduct, openWhatsApp } = useBazaar();
  const navigate = useNavigate();
  const saved = isProductSaved(product.id);
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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

  const imageUrl =
    (product.images && product.images.length > 0 ? product.images[0] : product.image) ||
    DEFAULT_PRODUCT_IMAGE;

  // Format large numbers cleanly (Cr / L notation if >= 10 Lacs) to avoid layout distortion
  const formatPrice = (val) => {
    if (!val || isNaN(val)) return '0';
    const num = Number(val);
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (num >= 1000000) {
      return `${(num / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    }
    return num.toLocaleString('en-IN');
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 transition-all duration-300 cursor-pointer p-3 flex flex-col justify-between h-full group shadow-2xs overflow-hidden"
    >
      <div>
        {/* Image Canvas with 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-[#ff3b30] text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button Overlay */}
          <button
            type="button"
            onClick={handleSaveClick}
            className={`absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white/90 shadow-xs flex items-center justify-center hover:scale-105 transition-all cursor-pointer z-10 border border-slate-100 ${
              saved ? 'text-rose-500' : 'text-slate-400'
            }`}
            title="Save Product"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
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
          <span className="text-[11px] sm:text-[10px] font-extrabold text-[#056839] uppercase tracking-wide truncate">
            {product.shopName || 'Digital Hub'}
          </span>

          {/* Title */}
          <h4 className="font-display text-sm font-bold text-slate-900 leading-snug line-clamp-1 mt-0.5 group-hover:text-[#056839] transition-colors">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs sm:text-[11px] font-semibold text-slate-600 tabular-nums">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
            <span>{product.rating || '4.4'}</span>
            <span className="text-slate-400 font-medium">({product.reviewsCount || '0'})</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1 font-price min-w-0 flex-1 overflow-hidden">
          <span
            className={`font-extrabold text-slate-900 tabular-nums truncate block ${
              (product.price || 0) >= 10000000
                ? 'text-xs'
                : (product.price || 0) >= 1000000
                ? 'text-xs sm:text-sm'
                : 'text-sm sm:text-base'
            }`}
            title={`₹${product.price?.toLocaleString('en-IN')}`}
          >
            ₹{formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span
              className="text-[10px] sm:text-xs text-slate-400 line-through font-medium tabular-nums truncate block"
              title={`₹${product.originalPrice?.toLocaleString('en-IN')}`}
            >
              ₹{formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* WhatsApp Direct Order Button */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="w-8 h-8 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-none flex-shrink-0 shadow-xs"
          title="Order on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
