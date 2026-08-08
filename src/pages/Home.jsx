import {
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  // Touch Swipe Gesture Handling for Mobile & Touch Devices
  const specialOfferTouchStartRef = useRef(null);
  const newArrivalTouchStartRef = useRef(null);

  const handleSpecialOfferTouchStart = (e) => {
    specialOfferTouchStartRef.current = e.touches[0].clientX;
  };

  const handleSpecialOfferTouchEnd = (e) => {
    if (specialOfferTouchStartRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = specialOfferTouchStartRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    specialOfferTouchStartRef.current = null;
  };

  const handleNewArrivalTouchStart = (e) => {
    newArrivalTouchStartRef.current = e.touches[0].clientX;
  };

  const handleNewArrivalTouchEnd = (e) => {
    if (newArrivalTouchStartRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = newArrivalTouchStartRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextNewArrivalSlide();
      } else {
        prevNewArrivalSlide();
      }
    }
    newArrivalTouchStartRef.current = null;
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

      {/* --- 3. STICKY SCROLLABLE CATEGORIES BAR (spans full width for sticky to work) --- */}
      <CategoryFilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4 pt-2 sm:pt-4">

        {/* --- 4. HERO ADVERTISEMENT SLIDER BANNER (DYNAMIC MULTI-OFFER CAROUSEL) --- */}
        {activeSpecialOffers.length > 0 && (() => {
          const activeOffer = activeSpecialOffers[currentSlideIndex] || activeSpecialOffers[0];
          if (!activeOffer) return null;

          return (
            <div
              onTouchStart={handleSpecialOfferTouchStart}
              onTouchEnd={handleSpecialOfferTouchEnd}
              className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group h-[260px] sm:h-[340px] md:h-[380px] w-full flex flex-col justify-end transition-all duration-500 select-none cursor-grab active:cursor-grabbing"
            >
              {/* Background Full Width Image with Smooth Zoom */}
              <img
                src={activeOffer.image}
                alt={activeOffer.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Subtle Full Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent transition-colors duration-500" />

              {/* Top Row: Category Tag Label & Offer Percentage Badge (Transparent Glass) */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20">
                <span className="px-3.5 py-1 sm:px-4.5 sm:py-1.5 rounded-full bg-orange-500/30 backdrop-blur-md border border-orange-200/40 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-xs">
                  {activeOffer.tag || 'SPECIAL OFFER'}
                </span>

                <span className="px-3.5 py-1 sm:px-4.5 sm:py-1.5 rounded-full bg-rose-600/80 backdrop-blur-md border border-rose-300/40 text-white font-black text-xs sm:text-sm shadow-md animate-pulse">
                  {activeOffer.discount}
                </span>
              </div>

              {/* Left Arrow Button */}
              {activeSpecialOffers.length > 1 && (
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Previous Offer"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Right Arrow Button */}
              {activeSpecialOffers.length > 1 && (
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Next Offer"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Floating Text (Title & Subtitle directly over image) */}
              <div className="relative z-20 p-4 sm:p-7 md:p-8 space-y-1.5 sm:space-y-2 text-left max-w-xl pb-6 sm:pb-8">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {activeOffer.title}
                </h2>

                <p className="text-xs sm:text-base font-semibold text-slate-100 line-clamp-2 leading-snug drop-shadow-md max-w-xl">
                  {activeOffer.subtitle}
                </p>

                {/* Orange Transparent Glass CTA Button */}
                <div className="pt-2.5 flex items-center gap-3">
                  <Link
                    to={(activeOffer.link || '/categories').replace('/shops', '/categories')}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-orange-600/85 hover:bg-orange-600 backdrop-blur-md border border-orange-300/40 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Shop Special Offer</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>

              {/* Carousel Indicator Dots */}
              {activeSpecialOffers.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                  {activeSpecialOffers.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`transition-all rounded-full cursor-pointer border-none ${
                        currentSlideIndex === idx
                          ? 'w-6 sm:w-8 h-2 bg-emerald-400 shadow-xs'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
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
            <div
              onTouchStart={handleNewArrivalTouchStart}
              onTouchEnd={handleNewArrivalTouchEnd}
              className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group h-[240px] sm:h-[320px] md:h-[360px] w-full flex flex-col justify-end transition-all duration-500 select-none cursor-grab active:cursor-grabbing"
            >
              {/* Background Full Width Image with Smooth Zoom */}
              <img
                src={currentArrival.image}
                alt={currentArrival.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Subtle Full Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent transition-colors duration-500" />

              {/* Top Left Tag Label (Transparent Glass) */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-6 z-20">
                <span className="px-3.5 py-1 sm:px-4.5 sm:py-1.5 rounded-full bg-amber-500/80 backdrop-blur-md border border-amber-300/40 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-md">
                  {currentArrival.tag || 'NEW ARRIVAL'}
                </span>
              </div>

              {/* Left Arrow Button */}
              {activeNewArrivals.length > 1 && (
                <button
                  type="button"
                  onClick={prevNewArrivalSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Previous New Arrival"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Right Arrow Button */}
              {activeNewArrivals.length > 1 && (
                <button
                  type="button"
                  onClick={nextNewArrivalSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Next New Arrival"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Floating Text (Title & Subtitle directly over image) */}
              <div className="relative z-20 p-4 sm:p-7 md:p-8 space-y-1.5 sm:space-y-2 text-left max-w-xl pb-6 sm:pb-8">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {currentArrival.title}
                </h2>

                <p className="text-xs sm:text-base font-semibold text-slate-100 line-clamp-2 leading-snug drop-shadow-md max-w-xl">
                  {currentArrival.subtitle}
                </p>

                {/* Non-green Amber Transparent Glass CTA Button */}
                <div className="pt-2.5 flex items-center gap-3">
                  <Link
                    to={(currentArrival.link || '/categories').replace('/shops', '/categories')}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-amber-600/85 hover:bg-amber-600 backdrop-blur-md border border-amber-300/40 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Explore New Collection</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>

              {/* Carousel Indicator Dots */}
              {activeNewArrivals.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                  {activeNewArrivals.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentNewArrivalIndex(idx)}
                      className={`transition-all rounded-full cursor-pointer border-none ${
                        currentNewArrivalIndex === idx
                          ? 'w-6 sm:w-8 h-2 bg-amber-400 shadow-xs'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
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
