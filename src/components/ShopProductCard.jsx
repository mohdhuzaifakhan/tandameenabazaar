import { useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/defaultAssets';

export default function ShopProductCard({ product }) {
  const { isProductSaved, toggleSaveProduct, openWhatsApp } = useBazaar();
  const navigate = useNavigate();

  if (!product) return null;

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
      className="relative bg-white rounded-2xl border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer p-3 flex flex-col justify-between h-full group"
    >
      <div>

        {/* Image Canvas with 4:3 Aspect Ratio (Full Width) */}
        <div className="relative aspect-[4/3] bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center">

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button Overlay */}
          <button
            onClick={handleSaveClick}
            className={`absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white/90 flex items-center justify-center text-[10px] hover:scale-105 hover:bg-red-50 transition-all cursor-pointer z-10 ${saved ? 'text-red-500' : 'text-slate-400'}`}
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
        <div className="mt-3.5 flex flex-col">
          {/* Brand Name */}
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider leading-none">
            {product.brand || 'LOCAL BRAND'}
          </span>

          {/* Title */}
          <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1 mt-1 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-600 tabular-nums">
            <span className="text-amber-400"><i className="fa-solid fa-star"></i></span>
            <span className="text-slate-800 font-bold">{product.rating || '4.8'}</span>
            <span className="text-slate-400 font-medium">({product.reviewsCount || '120'} Reviews)</span>
          </div>

          {/* Shop Info Label */}
          <div className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
            <span>In Stock</span>
          </div>
        </div>

      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col font-price">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none font-sans">Price</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-extrabold text-slate-900 tabular-nums">₹{product.price.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through tabular-nums">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* WhatsApp Direct Order Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center text-sm transition-colors cursor-pointer border-none"
          title="Order on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </button>
      </div>

    </div>
  );
}
