import {
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryFilterBar from '../components/CategoryFilterBar';
import ProductCard from '../components/ProductCard';
import { useBazaar } from '../context/BazaarContext';

export default function Home() {
  const { products, shops, banners } = useBazaar();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dynamic Special Offer & New Arrival Banners from Admin / Database (sorted latest first)
  const activeSpecialOffers = banners
    .filter(b => b.type === 'special_offer' && b.active !== false)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  const activeNewArrivals = banners
    .filter(b => b.type === 'new_arrival' && b.active !== false)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentNewArrivalIndex, setCurrentNewArrivalIndex] = useState(0);

  // Bounds-check slide index for Special Offers
  useEffect(() => {
    if (currentSlideIndex >= activeSpecialOffers.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSpecialOffers.length, currentSlideIndex]);

  // Bounds-check slide index for New Arrivals
  useEffect(() => {
    if (currentNewArrivalIndex >= activeNewArrivals.length) {
      setCurrentNewArrivalIndex(0);
    }
  }, [activeNewArrivals.length, currentNewArrivalIndex]);

  // Special Offers Auto-play slider timer (4.5 seconds)
  useEffect(() => {
    if (activeSpecialOffers.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSpecialOffers.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [activeSpecialOffers.length]);

  // New Arrivals Auto-play slider timer (5 seconds)
  useEffect(() => {
    if (activeNewArrivals.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentNewArrivalIndex(prev => (prev + 1) % activeNewArrivals.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [activeNewArrivals.length]);

  const nextSlide = () => {
    if (activeSpecialOffers.length > 0) {
      setCurrentSlideIndex(prev => (prev + 1) % activeSpecialOffers.length);
    }
  };

  const prevSlide = () => {
    if (activeSpecialOffers.length > 0) {
      setCurrentSlideIndex(prev => (prev - 1 + activeSpecialOffers.length) % activeSpecialOffers.length);
    }
  };

  const nextNewArrivalSlide = () => {
    if (activeNewArrivals.length > 0) {
      setCurrentNewArrivalIndex(prev => (prev + 1) % activeNewArrivals.length);
    }
  };

  const prevNewArrivalSlide = () => {
    if (activeNewArrivals.length > 0) {
      setCurrentNewArrivalIndex(prev => (prev - 1 + activeNewArrivals.length) % activeNewArrivals.length);
    }
  };



  // Dynamic daily countdown timer for "Best Deals of the Day" (Counts down to midnight)
  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = Math.max(0, midnight - now);

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Only products from verified shops or published products
  const verifiedShopIds = new Set(shops.filter(s => s.verified !== false).map(s => s.id));
  const publicProducts = products.filter(p => verifiedShopIds.has(p.shopId) || !p.shopId);

  // Filter products by selected category
  const filteredProducts = publicProducts.filter(p => {
    return selectedCategory === 'all' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
  });

  // Featured products list (sorted by rating / featured tag)
  const featuredProducts = [...filteredProducts]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // Best Deals of the Day (prioritize products flagged isDealOfDay by admin/seller, then highest discount percentage)
  const dealProducts = [...publicProducts]
    .sort((a, b) => {
      if (a.isDealOfDay && !b.isDealOfDay) return -1;
      if (!a.isDealOfDay && b.isDealOfDay) return 1;

      const discountA = a.originalPrice && a.originalPrice > a.price ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discountB = b.originalPrice && b.originalPrice > b.price ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discountB - discountA;
    })
    .filter(p => p.isDealOfDay || (p.originalPrice && p.originalPrice > p.price))
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] pb-16 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4 pt-2 sm:pt-4">

        {/* --- 3. HORIZONTALLY SCROLLABLE CATEGORIES ROW (REUSABLE COMPONENT) --- */}
        <CategoryFilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* --- 4. HERO ADVERTISEMENT SLIDER BANNER (DYNAMIC MULTI-OFFER CAROUSEL) --- */}
        {activeSpecialOffers.length > 0 && (() => {
          const activeOffer = activeSpecialOffers[currentSlideIndex] || activeSpecialOffers[0];
          if (!activeOffer) return null;

          return (
            <div className={`${activeOffer.bgColor || 'bg-[#eaf5ef]'} ${activeOffer.borderColor || 'border-emerald-100/90'} rounded-3xl border p-4 sm:p-7 relative overflow-hidden flex flex-row items-center justify-between gap-3 min-h-[165px] sm:min-h-[220px] transition-colors duration-500 group`}>

              {/* Left Arrow Button */}
              {activeSpecialOffers.length > 1 && (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200/60 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Previous Offer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Right Arrow Button */}
              {activeSpecialOffers.length > 1 && (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200/60 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Next Offer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Left Text Content Block */}
              <div className="space-y-1.5 sm:space-y-3 z-10 flex-1 min-w-0 text-left pl-3 sm:pl-6">
                <span className={`text-[9px] sm:text-[10px] font-black ${activeOffer.tagColor || 'text-[#056839]'} uppercase tracking-widest block`}>
                  {activeOffer.tag}
                </span>

                <h2 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeOffer.title}
                </h2>

                <p className="text-[10.5px] sm:text-xs text-slate-600 font-medium truncate">
                  {activeOffer.subtitle}
                </p>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full ${activeOffer.btnBg || 'bg-[#056839]'} text-white font-black text-[10px] sm:text-xs`}>
                    {activeOffer.discount}
                  </span>
                  <Link
                    to={(activeOffer.link || '/categories').replace('/shops', '/categories')}
                    className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-white border border-slate-200/80 text-slate-900 font-extrabold text-[10px] sm:text-xs inline-flex items-center gap-1 sm:gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-900" />
                  </Link>
                </div>
              </div>

              {/* Right Product Display Image Canvas */}
              <div className="relative shrink-0 w-28 h-28 sm:w-52 sm:h-52 flex items-center justify-center pr-2 sm:pr-4">
                <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-xs border border-white"></div>
                <img
                  src={activeOffer.image}
                  alt={activeOffer.title}
                  className="w-24 h-24 sm:w-44 sm:h-44 object-contain z-10 hover:scale-105 transition-transform rounded-xl"
                />
                {/* Floating Discount Badge */}
                <span className={`absolute top-0 right-1 sm:right-2 ${activeOffer.btnBg || 'bg-[#056839]'} text-white font-black text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg z-20`}>
                  {activeOffer.discount}
                </span>
              </div>

              {/* Carousel Indicator Dots */}
              {activeSpecialOffers.length > 1 && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-30">
                  {activeSpecialOffers.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`transition-all rounded-full cursor-pointer border-none ${currentSlideIndex === idx
                        ? 'w-4 sm:w-5 h-1.5 sm:h-2 bg-slate-900'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400/60 hover:bg-slate-600'
                        }`}
                      title={`Go to offer ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })()}

        {/* --- 5. TRUST BADGES STRIP --- */}
        {/* <div className="bg-white rounded-2xl border border-slate-200/80 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 block leading-none">Best Prices</span>
            <span className="text-[10px] text-slate-500 font-medium">On all products</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 block leading-none">Verified Sellers</span>
            <span className="text-[10px] text-slate-500 font-medium">100% trusted</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 block leading-none">Fast Delivery</span>
            <span className="text-[10px] text-slate-500 font-medium">Quick & safe</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 block leading-none">Easy Returns</span>
            <span className="text-[10px] text-slate-500 font-medium">Hassle free</span>
          </div>
        </div>
      </div> */}

        {/* --- 6. FEATURED PRODUCTS SECTION --- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Featured Products</h3>
            <Link to="/categories" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featuredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

        {/* --- 7. NEW ARRIVAL PROMOTION BANNER CAROUSEL (MULTI-SLIDE DYNAMIC FROM DATABASE) --- */}
        {activeNewArrivals.length > 0 && (() => {
          const currentArrival = activeNewArrivals[currentNewArrivalIndex] || activeNewArrivals[0];
          if (!currentArrival) return null;

          return (
            <div className={`${currentArrival.bgColor || 'bg-[#f4efe8]'} ${currentArrival.borderColor || 'border-amber-200/60'} rounded-3xl border p-4 sm:p-7 relative overflow-hidden flex flex-row items-center justify-between gap-3 min-h-[140px] sm:min-h-[180px] transition-colors duration-500 group`}>

              {/* Left Arrow Button */}
              {activeNewArrivals.length > 1 && (
                <button
                  type="button"
                  onClick={prevNewArrivalSlide}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200/60 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Previous New Arrival"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Right Arrow Button */}
              {activeNewArrivals.length > 1 && (
                <button
                  type="button"
                  onClick={nextNewArrivalSlide}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center border border-slate-200/60 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Next New Arrival"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Left Text Content Block */}
              <div className="space-y-1.5 sm:space-y-2 z-10 flex-1 min-w-0 text-left pl-3 sm:pl-6">
                <span className={`text-[9px] sm:text-[10px] font-black ${currentArrival.tagColor || 'text-amber-800'} uppercase tracking-widest block`}>
                  {currentArrival.tag || 'NEW ARRIVAL'}
                </span>
                <h2 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentArrival.title}
                </h2>
                <p className="text-[10.5px] sm:text-xs text-slate-600 font-medium truncate">
                  {currentArrival.subtitle}
                </p>
                <div className="pt-1">
                  <Link
                    to={(currentArrival.link || '/categories').replace('/shops', '/categories')}
                    className={`px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl ${currentArrival.btnBg || 'bg-[#056839]'} text-white font-extrabold text-[10px] sm:text-xs inline-flex items-center gap-1 sm:gap-2 hover:bg-emerald-800 transition-colors`}
                  >
                    Explore Now
                  </Link>
                </div>
              </div>

              {/* Right Image Canvas */}
              <div className="relative shrink-0 w-28 h-24 sm:w-56 sm:h-40 flex items-center justify-center pr-2 sm:pr-4">
                <img
                  src={currentArrival.image}
                  alt={currentArrival.title}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-2xs"
                />
              </div>

              {/* Carousel Indicator Dots */}
              {activeNewArrivals.length > 1 && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-30">
                  {activeNewArrivals.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentNewArrivalIndex(idx)}
                      className={`transition-all rounded-full cursor-pointer border-none ${currentNewArrivalIndex === idx
                        ? 'w-4 sm:w-5 h-1.5 sm:h-2 bg-slate-900'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400/60 hover:bg-slate-600'
                        }`}
                      title={`Go to arrival banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })()}

        {/* --- 8. BEST DEALS OF THE DAY SECTION --- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 px-1 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                Best Deals of the Day
              </h3>

              {/* Compact Countdown Timer Pill */}
              <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200/80">
                <span className="bg-slate-900 text-white px-1 py-0.5 rounded leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-1 py-0.5 rounded leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-1 py-0.5 rounded leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>

            <Link to="/categories" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dealProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div >
  );
}
