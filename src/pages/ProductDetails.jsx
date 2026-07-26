import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import { useImageModal } from '../context/ImageModalContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, shops, isProductSaved, toggleSaveProduct, openWhatsApp } = useBazaar();
  const { userProfile } = useAuth();
  const { openImageModal } = useImageModal();
  
  const currentProductId = id || 'samsung-m16-5g';
  const product = products.find(p => p.id === currentProductId);
  const shop = shops.find(s => s.id === product?.shopId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('desc');
  const [readMore, setReadMore] = useState(false);
  const [slideDir, setSlideDir] = useState(''); // 'left' | 'right'
  const [isSliding, setIsSliding] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setActiveTab('desc');
      setReadMore(false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="w-full py-16 text-center text-slate-400 space-y-4">
        <i className="fa-solid fa-box-open text-4xl text-slate-300"></i>
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for is unavailable or has been removed.</p>
        <Link to="/shops" className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl inline-block">
          Explore Products & Stores
        </Link>
      </div>
    );
  }

  // Verification Access Control: Block public access if merchant storefront is unverified
  const isOwnerOrAdmin = (userProfile?.role === 'admin') || (userProfile?.uid === shop?.ownerUid) || (userProfile?.shopId === shop?.id);

  if (shop && !shop.verified && !isOwnerOrAdmin) {
    return (
      <div className="w-full py-16 px-4 text-center space-y-4 max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto shadow-inner border border-amber-200">
          <i className="fa-solid fa-box-archive"></i>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Product Unavailable</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          The merchant storefront listing this product is currently under admin verification or delisted. This item is not visible to public buyers.
        </p>
        <div className="pt-2">
          <Link to="/shops" className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm">
            <i className="fa-solid fa-arrow-left"></i> Explore Active Stores
          </Link>
        </div>
      </div>
    );
  }

  // Close zoom on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setZoomOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const goToImage = (index, dir) => {
    if (isSliding) return;
    setSlideDir(dir);
    setIsSliding(true);
    setTimeout(() => {
      setActiveImageIndex(index);
      setIsSliding(false);
      setSlideDir('');
    }, 220);
  };

  const handlePrevImage = () => {
    const prev = activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1;
    goToImage(prev, 'right');
  };

  const handleNextImage = () => {
    const next = activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1;
    goToImage(next, 'left');
  };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? handleNextImage() : handlePrevImage();
    touchStartX.current = null;
  };

  const saved = isProductSaved(product.id);
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 6);
  const images = product.images || [product.image];
  const activeImage = images[activeImageIndex] || '';
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="w-full py-4 flex flex-col gap-8 animate-fade-in pb-20 md:pb-6">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <Link to="/shops" className="hover:text-emerald-600 transition-colors">Shops</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <Link to={`/shop/${shop.id}`} className="hover:text-emerald-600 transition-colors">{shop.name}</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-800 line-clamp-1">{product.name}</span>
      </div>

      {/* Main product display split columns */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="flex flex-col gap-4">
          <div
            className="w-full aspect-[4/3] sm:aspect-square md:h-[460px] rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden cursor-zoom-in select-none group"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => openImageModal(activeImage, product.name)}
            title="Click to view fullscreen photo"
          >
            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 text-white font-black text-xs uppercase tracking-wide rounded-md shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-emerald-600 text-white font-black text-xs uppercase tracking-wide rounded-md shadow-sm">
                {product.badge}
              </span>
            )}

            {/* Slider Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all cursor-pointer opacity-80 hover:opacity-100"
                  title="Previous Image"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all cursor-pointer opacity-80 hover:opacity-100"
                  title="Next Image"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </>
            )}

            <img 
              src={activeImage} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-all duration-300 ${isSliding ? (slideDir === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0') : 'translate-x-0 opacity-100'}`} 
            />
          </div>

          {/* Indicator dots for mobile */}
          <div className="flex justify-center gap-1.5 mt-1 lg:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeImageIndex === idx ? 'bg-emerald-600 w-5' : 'bg-slate-300'}`}
                onClick={() => setActiveImageIndex(idx)}
              />
            ))}
          </div>

          {/* Thumbnail Strip (Desktop Only) */}
          {images.length > 1 && (
            <div className="hidden lg:flex gap-3 overflow-x-auto pb-1 mt-1">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`w-16 h-16 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${activeImageIndex === idx ? 'border-emerald-500' : 'border-slate-100 hover:border-slate-200'}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest font-sans">{product.brand || 'Local Brand'}</span>
            <h1 className="font-display text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-1 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-2.5 tabular-nums">
              <span className="flex items-center gap-1"><i className="fa-solid fa-star text-amber-500"></i> {product.rating || '4.5'} ({product.reviewsCount || '120'} Reviews)</span>
              <span>&bull;</span>
              <span className="text-slate-800">{product.soldCount || '210'} Sold</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-100/50 rounded-2xl flex items-baseline gap-2.5 w-fit min-w-[200px] font-price">
            <span className="text-3xl font-extrabold text-emerald-900 tabular-nums">₹{product.price.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <>
                <span className="text-xs text-slate-400 line-through tabular-nums font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="px-2 py-0.5 bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider rounded font-sans">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Available at store box */}
          <div className="p-5 border border-slate-100 rounded-2xl bg-white flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available at Store</span>
              <div className="flex items-center gap-1">
                <Link to={`/shop/${shop.id}`} className="font-display text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                  {shop.name}
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                </Link>
              </div>
              <span className="text-xs text-slate-500 font-medium">{shop.address}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1">
              <i className="fa-solid fa-star text-amber-500"></i> {shop.rating}
            </div>
          </div>

          {/* Product Highlights */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Highlights</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
              {product.highlights && product.highlights.length > 0 ? (
                product.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-600"></i> {h}</li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-600"></i> Premium quality local product</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-600"></i> Inquire directly with seller on WhatsApp</li>
                </>
              )}
            </ul>
          </div>

          {/* CTA Buttons (Desktop Only) */}
          <div className="hidden md:flex gap-3 mt-4">
            <button 
              onClick={() => openWhatsApp(product.id)} 
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i> Order on WhatsApp
            </button>
            <button 
              onClick={() => toggleSaveProduct(product.id)} 
              className={`px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors ${saved ? 'text-red-500 bg-red-50/20' : 'text-slate-700 bg-white'}`}
            >
              <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> {saved ? 'Saved' : 'Save'}
            </button>
          </div>
          <p className="hidden md:block text-[10px] text-slate-400 text-center font-semibold">
            You will be redirected to WhatsApp to complete your checkout directly with the shop manager.
          </p>
        </div>

      </div>

      {/* Tabs description and specifications */}
      <section className="mt-8 flex flex-col gap-6">
        <div className="flex border-b border-slate-100 gap-6">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'desc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'specs' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Specifications
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Reviews ({product.reviewsCount || '120'})
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 text-xs md:text-sm leading-relaxed text-slate-500">
          {activeTab === 'desc' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left description */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <p>{readMore ? product.description : `${product.description.substring(0, 160)}...`}</p>
                <button 
                  onClick={() => setReadMore(!readMore)} 
                  className="w-fit text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  {readMore ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-chevron-${readMore ? 'up' : 'down'} text-[8px]`}></i>
                </button>
              </div>

              {/* Right specs snippet */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3 h-fit">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Product Info</div>
                <table className="w-full text-left text-[11px]">
                  <tbody>
                    <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Brand</td><td className="py-2 text-slate-800 font-bold">{product.brand || 'Generic'}</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Condition</td><td className="py-2 text-slate-800 font-bold">New</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Availability</td><td className="py-2 text-emerald-600 font-bold">In Stock</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="w-full text-left text-xs max-w-xl">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} className="border-b border-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-400 w-44 bg-slate-50/50">{key}</td>
                        <td className="py-3 px-4 text-slate-800 font-semibold">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-50 pb-4">
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-slate-800">Amit Saxena</strong>
                  <span className="text-amber-500"><i className="fa-solid fa-star text-[10px]"></i> 5.0</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-normal">"Excellent product quality. Contacted the merchant via WhatsApp and collected it from the store in Gandhi Market."</p>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-slate-800">Rohan Kumar</strong>
                  <span className="text-amber-500"><i className="fa-solid fa-star text-[10px]"></i> 4.5</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-normal">"Original packaging and warranty terms matched exactly. Great experience shopping locally."</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-6 mt-8">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-black text-slate-900">Related Products</h2>
            <Link to="/shops" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Actions Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center z-50 px-4">
        <button 
          onClick={() => toggleSaveProduct(product.id)} 
          className={`flex flex-col items-center justify-center gap-1 text-[10px] bg-transparent border-none ${saved ? 'text-red-500' : 'text-slate-400'}`}
        >
          <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
          <span>Save</span>
        </button>
        <button 
          onClick={() => openWhatsApp(product.id)} 
          className="flex-1 max-w-[240px] py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i> Order on WhatsApp
        </button>
      </div>

    </div>
  );
}
