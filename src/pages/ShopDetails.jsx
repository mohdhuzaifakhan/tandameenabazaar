import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import ShopProductCard from '../components/ShopProductCard';

export default function ShopDetails() {
  const { id } = useParams();
  const { shops, products } = useBazaar();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'about', 'reviews'
  const [inShopSearch, setInShopSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find current shop
  const currentShopId = id || 'sharma-mobile';
  const shop = shops.find(s => s.id === currentShopId) || shops[0];

  // Filter products by shop
  const shopProducts = products.filter(p => p.shopId === shop.id);

  // Get unique categories for this shop
  const shopCategories = ['all', ...new Set(shopProducts.map(p => p.category))];

  // Filter products by search and category
  const filteredProducts = shopProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inShopSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(inShopSearch.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppContact = () => {
    const text = `Hello ${shop.name}, I found your shop on Digital Meena Bazaar.`;
    window.open(`https://wa.me/${shop.phone || '919876543210'}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareShop = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on Digital Meena Bazaar!`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <Link to="/shops" className="hover:text-emerald-600 transition-colors">Shops</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-800">{shop.name}</span>
      </div>

      {/* Cover Image banner */}
      <div className="h-48 md:h-72 w-full rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200">
        <img src={shop.bannerImage} alt={`${shop.name} Cover`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Profile summary card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 -mt-16 md:-mt-24 relative z-10 mx-4 md:mx-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-end">
            {/* Floating Logo */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0">
              <img src={shop.logoImage} alt={shop.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">{shop.name}</h1>
                {shop.verified && <i className="fa-solid fa-circle-check text-emerald-600 text-base" title="Verified Store"></i>}
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{shop.categoryName || 'Boutique Brand'}</span>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold mt-1">
                <span className="flex items-center gap-1"><i className="fa-solid fa-star text-amber-500"></i> {shop.rating} ({shop.reviewsCount} Reviews)</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-slate-400"></i> {shop.market}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <button 
              onClick={handleWhatsAppContact}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-emerald-600"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i> Contact Merchant
            </button>
            <button 
              onClick={handleShareShop}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              title="Share Shop"
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i> Share
            </button>
          </div>

        </div>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
        
        {/* Left Side: Merchant Info Cards */}
        <aside className="flex flex-col gap-6">
          {/* Shopkeeper details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Merchant Profile</h3>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" alt="Owner" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-black text-slate-800 text-xs">Mohd. Shadab</div>
                <span className="text-[10px] text-slate-400 font-semibold">Store Manager</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">"Welcome to our storefront. All catalog orders can be directly coordinated via WhatsApp. We coordinate home delivery and store collection options."</p>
          </div>

          {/* Hours Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Business Details</h3>
            <div className="flex flex-col gap-2 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Hours:</span>
                <span className="font-bold text-emerald-600">10:00 AM – 09:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Response time:</span>
                <span className="font-bold text-slate-800">Under 15 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Years Active:</span>
                <span className="font-bold text-slate-800">Est. 5 Years</span>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Shop Address</h3>
            <p className="text-[11px] text-slate-500 leading-normal"><i className="fa-solid fa-location-dot text-emerald-600 mr-1"></i> {shop.address}</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full py-2 text-center bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-map"></i> View on Google Maps
            </a>
          </div>
        </aside>

        {/* Right Side: Tab panel and catalog */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Tab nav links */}
          <div className="flex border-b border-slate-100 gap-6">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'products' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Catalog ({shopProducts.length})
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'about' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              About Seller
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Reviews ({shop.reviewsCount})
            </button>
          </div>

          {/* TAB 1: CATALOG PRODUCTS */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6">
              
              {/* Search catalog bar */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input 
                    type="text"
                    placeholder="Search inside this store..."
                    value={inShopSearch}
                    onChange={e => setInShopSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                {/* Category quick selectors */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {shopCategories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${selectedCategory === cat ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat === 'all' ? 'All Items' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of catalog cards */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center text-lg"><i className="fa-solid fa-magnifying-glass"></i></div>
                  <h4 className="font-bold text-slate-800 text-xs">No matching products</h4>
                  <p className="text-xs text-slate-400">Try adjusting your category pills or search query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map(prod => (
                    <ShopProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ABOUT SELLER */}
          {activeTab === 'about' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 leading-relaxed">
              <div>
                <h3 className="font-black text-slate-900 text-sm mb-2">Store Biography</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">{shop.description || 'Welcome to our verified local store. We operate directly within Rampur to provide top-quality collections and tech accessories. Complete order coordination occurs directly through WhatsApp.'}</p>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-black text-slate-900 text-sm mb-3">Verified Business Guidelines</h3>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-500 font-normal">
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Direct-to-merchant pricing without middleman fees.</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Store collection options available immediately during business hours.</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Guaranteed support response times on chat inquiries.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">Customer Reviews ({shop.reviewsCount})</h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-800">Amit Saxena</strong>
                    <span className="text-amber-500"><i className="fa-solid fa-star text-[10px]"></i> 5.0</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-normal leading-relaxed">"Great store with excellent response times. Ordered my new smartphone via their WhatsApp link, and picked it up within 2 hours at the market."</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-800">Farhan Khan</strong>
                    <span className="text-amber-500"><i className="fa-solid fa-star text-[10px]"></i> 4.5</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-normal leading-relaxed">"Verified and trusted shopkeeper. They checked the product and warranty papers right in front of me during store pickup."</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
