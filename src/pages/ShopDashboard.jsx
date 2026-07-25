import React, { useState, useEffect } from 'react';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import ImageUploader from '../components/ImageUploader';

export default function ShopDashboard() {
  const { userProfile } = useAuth();
  const { 
    shops, 
    products, 
    orders, 
    createShop,
    updateShopDetails, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    categories,
    markets 
  } = useBazaar();

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Active Tab state: 'overview' | 'products' | 'store' | 'orders'
  const [activeTab, setActiveTab] = useState('overview');

  // Find shop owned by current logged in user (by ownerUid or profile shopId)
  const userShop = shops.find(s => s.ownerUid === userProfile?.uid || s.id === userProfile?.shopId);

  // Shop Creation Wizard State
  const [showCreateWizard, setShowCreateWizard] = useState(!userShop);
  const [creating, setCreating] = useState(false);

  const [newStoreForm, setNewStoreForm] = useState({
    name: userProfile?.displayName ? `${userProfile.displayName}'s Store` : '',
    category: 'Electronics',
    market: 'Main Market',
    phone: '+919876543210',
    whatsapp: '919876543210',
    timing: '10:00 AM - 9:00 PM',
    address: 'Shop No. 12, Main Market Road',
    description: 'Official storefront serving customers on Meena Bazaar.',
    image: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80'
  });

  const handleCreateShop = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const created = await createShop(newStoreForm, userProfile?.uid);
      setCreating(false);
      setShowCreateWizard(false);
      showToast(`Storefront "${created.name}" launched successfully!`);
    } catch (err) {
      console.error("Error creating shop:", err);
      setCreating(false);
      showToast("Failed to create storefront. Please try again.", "error");
    }
  };

  // Active shop resolution
  const shop = userShop || shops[0] || {
    id: 'demo-shop',
    name: newStoreForm.name || 'My Storefront',
    category: 'Electronics',
    market: 'Main Market',
    phone: '+919876543210',
    whatsapp: '919876543210',
    rating: 5.0,
    reviewsCount: 1,
    verified: true,
    timing: '10:00 AM - 9:00 PM',
    address: 'Main Market Road',
    description: 'Official store on Meena Bazaar.',
    image: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80'
  };

  // Filter products and orders belonging to this active shop
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const shopOrders = orders.filter(o => o.shopId === shop.id);

  // ── Store Form State ──
  const [storeForm, setStoreForm] = useState({
    name: shop.name || '',
    category: shop.category || 'Electronics',
    market: shop.market || 'Main Market',
    phone: shop.phone || '',
    whatsapp: shop.whatsapp || '',
    timing: shop.timing || '10:00 AM - 9:00 PM',
    address: shop.address || '',
    description: shop.description || '',
    image: shop.image || '',
    banner: shop.banner || ''
  });

  const [savingStore, setSavingStore] = useState(false);

  useEffect(() => {
    if (shop) {
      setStoreForm({
        name: shop.name || '',
        category: shop.category || 'Electronics',
        market: shop.market || 'Main Market',
        phone: shop.phone || '',
        whatsapp: shop.whatsapp || '',
        timing: shop.timing || '10:00 AM - 9:00 PM',
        address: shop.address || '',
        description: shop.description || '',
        image: shop.image || '',
        banner: shop.banner || ''
      });
    }
  }, [shop.id]);

  const handleSaveStoreProfile = async (e) => {
    e.preventDefault();
    setSavingStore(true);
    try {
      await updateShopDetails(shop.id, storeForm);
      setSavingStore(false);
      showToast("Storefront profile details updated successfully!");
    } catch (err) {
      console.error("Error saving store profile:", err);
      setSavingStore(false);
      showToast("Could not update store profile.", "error");
    }
  };

  // ── Product Search & Filter State ──
  const [productSearch, setProductSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredProducts = shopProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesStock = stockFilter === 'all' || (p.stockStatus || 'In Stock') === stockFilter;
    return matchesSearch && matchesStock;
  });

  // ── Product Add/Edit Modal State ──
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '', brand: '', price: '', originalPrice: '',
    category: 'electronics', categoryName: 'Electronics',
    description: '', image: '', highlights: '',
    stockStatus: 'In Stock', status: 'Active'
  });

  const openAddModal = () => {
    setModalMode('add');
    setProductForm({
      name: '', brand: '', price: '', originalPrice: '',
      category: 'electronics', categoryName: 'Electronics',
      description: '',
      images: [],
      highlights: 'Original Warranty, Local Store Delivery',
      stockStatus: 'In Stock', status: 'Active'
    });
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand || '',
      price: product.price ? product.price.toString() : '',
      originalPrice: product.originalPrice ? product.originalPrice.toString() : (product.price ? product.price.toString() : ''),
      category: product.category || 'electronics',
      categoryName: product.categoryName || 'Electronics',
      description: product.description || '',
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      highlights: product.highlights ? product.highlights.join(', ') : '',
      stockStatus: product.stockStatus || 'In Stock',
      status: product.status || 'Active'
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);

    const highlightsArr = productForm.highlights
      ? productForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    const defaultImg = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80';

    const productPayload = {
      name: productForm.name,
      brand: productForm.brand,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice || productForm.price),
      category: productForm.category,
      categoryName: productForm.categoryName,
      description: productForm.description,
      images: productForm.images && productForm.images.length > 0 ? productForm.images : [defaultImg],
      highlights: highlightsArr,
      stockStatus: productForm.stockStatus,
      status: productForm.status,
      shopId: shop.id,
      shopName: shop.name
    };

    try {
      if (modalMode === 'add') {
        await addProduct(productPayload);
        showToast(`Product "${productForm.name}" added to catalog!`);
      } else {
        await updateProduct({ ...editingProduct, ...productPayload });
        showToast(`Product "${productForm.name}" updated!`);
      }
      setSavingProduct(false);
      setShowProductModal(false);
    } catch (err) {
      console.error("Error saving product:", err);
      setSavingProduct(false);
      showToast("Error saving product. Please check form data.", "error");
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = product.stockStatus === 'Out of Stock' ? 'In Stock' : 'Out of Stock';
    await updateProduct({ ...product, stockStatus: newStock });
    showToast(`${product.name} marked as ${newStock}`);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setDeleting(false);
      showToast(`Product "${productToDelete.name}" deleted.`);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setDeleting(false);
      showToast("Failed to delete product.", "error");
    }
  };

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const filteredOrders = shopOrders.filter(o => {
    return orderStatusFilter === 'all' || o.status === orderStatusFilter;
  });

  const totalCatalogValue = shopProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const stats = [
    { label: 'Total Products', value: shopProducts.length, icon: 'fa-box', color: 'bg-emerald-50 text-emerald-600', trend: 'Live Catalog' },
    { label: 'Store Rating', value: `${shop.rating || 5.0} ★`, icon: 'fa-star', color: 'bg-amber-50 text-amber-500', trend: `${shop.reviewsCount || 1} Reviews` },
    { label: 'Customer Leads', value: shopOrders.length, icon: 'fa-message', color: 'bg-emerald-50 text-emerald-600', trend: 'WhatsApp Leads' },
    { label: 'Inventory Value', value: `₹${totalCatalogValue.toLocaleString('en-IN')}`, icon: 'fa-indian-rupee-sign', color: 'bg-blue-50 text-blue-600', trend: 'Active Items' },
  ];

  return (
    <DashboardLayout title="Shop Management" role="shop">
      
      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce ${
          toastMessage.type === 'error'
            ? 'bg-rose-950 text-rose-200 border-rose-800'
            : 'bg-emerald-950 text-emerald-200 border-emerald-800'
        }`}>
          <i className={`fa-solid ${toastMessage.type === 'error' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-check text-emerald-400'} text-base`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in pb-12">

        {/* ── Shop Onboarding Prompt (If user has no shop yet) ── */}
        {!userShop && (
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/40">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30 inline-block">
                Merchant Registration
              </span>
              <h2 className="text-xl md:text-2xl font-black">Register Your Storefront</h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Welcome! Set up your store name, market location, contact phone, and start listing your products to receive customer leads directly on WhatsApp.
              </p>
            </div>
            <button
              onClick={() => setShowCreateWizard(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex-shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-store"></i> Set Up Storefront Now
            </button>
          </div>
        )}

        {/* ── Shop Banner Header ── */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
          <div className="h-32 md:h-44 w-full relative">
            <img 
              src={shop.banner || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80'} 
              alt={shop.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative -mt-12 md:-mt-16 z-10">
            <div className="flex items-center gap-4 min-w-0 flex-1 w-full md:w-auto">
              <img 
                src={shop.image || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80'} 
                alt={shop.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-800 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl md:text-3xl font-black text-white leading-tight break-words">{shop.name}</h1>
                  {shop.verified && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black flex-shrink-0" title="Verified Merchant">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-2 flex-wrap">
                  <span><i className="fa-solid fa-location-dot text-emerald-400"></i> {shop.market || 'Main Market'}</span>
                  <span>•</span>
                  <span><i className="fa-solid fa-tag text-emerald-400"></i> {shop.category || 'Electronics'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto">
              <button
                onClick={() => setShowCreateWizard(true)}
                className="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <i className="fa-solid fa-plus-circle"></i> Create New Store
              </button>
              <button
                onClick={openAddModal}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <i className="fa-solid fa-plus text-sm"></i> Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs (Mobile Touch-Scrollable) ── */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto flex-nowrap scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-950 text-white font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-chart-pie"></i> Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'products'
                ? 'bg-emerald-950 text-white font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Product Catalog ({shopProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'store'
                ? 'bg-emerald-950 text-white font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-store"></i> Store Profile Settings
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-emerald-950 text-white font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-list-check"></i> WhatsApp Leads ({shopOrders.length})
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: OVERVIEW & PERFORMANCE */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${s.color}`}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{s.trend}</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">{s.value}</h3>
                    <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Products List */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Recent Products</h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">
                    View All ({shopProducts.length})
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {shopProducts.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                      <p className="text-xs mb-3">No products added to this store yet.</p>
                      <button onClick={openAddModal} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                        Add First Product
                      </button>
                    </div>
                  ) : (
                    shopProducts.slice(0, 5).map(product => (
                      <div key={product.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'} 
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                            <p className="text-[11px] text-slate-400">{product.categoryName || 'General'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">₹{product.price?.toLocaleString('en-IN')}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            product.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {product.stockStatus || 'In Stock'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Store Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between border border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                    <i className="fa-solid fa-shop"></i> Storefront Status
                  </div>
                  <h3 className="text-lg font-black text-white">{shop.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{shop.description}</p>
                  
                  <div className="mt-6 space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Phone Contact:</span>
                      <span className="font-semibold text-white">{shop.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">WhatsApp Lead #:</span>
                      <span className="font-semibold text-emerald-400">{shop.whatsapp}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Store Hours:</span>
                      <span className="font-semibold text-white">{shop.timing}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('store')}
                  className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Store Profile
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: PRODUCT INVENTORY MANAGEMENT */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    placeholder="Search products by title or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 font-medium cursor-pointer"
                >
                  <option value="all">All Stock Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <button
                onClick={openAddModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i> Add Product
              </button>
            </div>

            {/* Products Container (Responsive Mobile Cards + Desktop Table) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              
              {/* Mobile View: Clean Product Cards (sm:hidden) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 p-4">
                    <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                    <p className="text-xs mb-3">No products match your search or filter.</p>
                    <button onClick={openAddModal} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                      Add New Product
                    </button>
                  </div>
                ) : (
                  filteredProducts.map(p => (
                    <div key={p.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'} 
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{p.categoryName || p.category}</span>
                            <div className="mt-1">
                              <span className="font-black text-xs text-slate-900">₹{p.price?.toLocaleString('en-IN')}</span>
                              {p.originalPrice > p.price && (
                                <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                            p.stockStatus === 'Out of Stock' 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {p.stockStatus || 'In Stock'}
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-pen text-xs"></i> Edit
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View: Full Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 whitespace-nowrap">Product Details</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Price</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Stock Status</th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-400">
                          <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                          <p className="text-xs mb-3">No products match your search or filter.</p>
                          <button onClick={openAddModal} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                            Add New Product
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'} 
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{p.name}</span>
                                <span className="text-[10px] text-slate-400">{p.brand || 'Merchant Product'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                            {p.categoryName || p.category}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                            ₹{p.price?.toLocaleString('en-IN')}
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-slate-400 line-through block font-normal">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                p.stockStatus === 'Out of Stock' 
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {p.stockStatus || 'In Stock'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(p)}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Edit Product"
                            >
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Delete Product"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: STOREFRONT PROFILE MANAGEMENT */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'store' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
            
            <div>
              <h2 className="text-xl font-black text-slate-900">Edit Store Profile</h2>
              <p className="text-xs text-slate-500 mt-1">Update your storefront details visible to customers on Meena Bazaar.</p>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-6">
              
              {/* Grid 1: Basic Store Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Store Category *</label>
                  <select
                    value={storeForm.category}
                    onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Market / Location *</label>
                  <select
                    value={storeForm.market}
                    onChange={(e) => setStoreForm({ ...storeForm, market: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                  >
                    {markets.map((m, idx) => {
                      const name = typeof m === 'object' ? (m.name || m.id) : m;
                      return <option key={idx} value={name}>{name}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Store Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 9:00 PM"
                    value={storeForm.timing}
                    onChange={(e) => setStoreForm({ ...storeForm, timing: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Grid 2: Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Contact Number</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">WhatsApp Order Lead Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 919876543210"
                    value={storeForm.whatsapp}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Physical Address</label>
                <input
                  type="text"
                  placeholder="Shop No., Street, Market Name, City"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              {/* Store Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Store Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe your shop specialties, products, and services..."
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                ></textarea>
              </div>

              {/* Store Image Uploaders */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <ImageUploader
                  label="Store Avatar / Logo"
                  value={storeForm.image}
                  onChange={(url) => setStoreForm({ ...storeForm, image: url })}
                  aspectRatio="square"
                />

                <ImageUploader
                  label="Store Cover Banner Image"
                  value={storeForm.banner}
                  onChange={(url) => setStoreForm({ ...storeForm, banner: url })}
                  aspectRatio="banner"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingStore}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingStore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Store...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> Save Store Profile
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 4: CUSTOMER LEADS & ORDERS */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customer Leads & Inquiries</h2>
                <p className="text-xs text-slate-500">Track customer order requests generated via WhatsApp and storefront inquiries.</p>
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 font-medium cursor-pointer"
              >
                <option value="all">All Lead Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <i className="fa-solid fa-comments text-3xl mb-2 text-slate-300 block"></i>
                  No order leads match your selection.
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        <i className="fa-solid fa-bag-shopping"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">{order.id}</span>
                          <span className="text-[10px] text-slate-400">• {order.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5">{order.productName}</h4>
                        <p className="text-[11px] text-slate-500">
                          Customer: <span className="font-semibold text-slate-700">{order.customerName}</span> ({order.customerPhone})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-sm font-black text-slate-900 mr-2">₹{order.price?.toLocaleString('en-IN')}</span>

                      <a
                        href={`https://wa.me/${order.customerPhone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-sm text-emerald-600"></i>
                        <span>WhatsApp Chat</span>
                      </a>

                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value);
                          showToast(`Lead ${order.id} marked as ${e.target.value}`);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${
                          order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto">
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Delete Product?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <strong className="text-slate-800">{productToDelete.name}</strong> from your store catalog? This action cannot be undone.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDeleteProduct}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can"></i> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SHOP CREATION WIZARD MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showCreateWizard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase">MERCHANT ONBOARDING</span>
                <h3 className="text-xl font-black text-slate-900">Create Your Storefront</h3>
              </div>
              <button onClick={() => setShowCreateWizard(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khan Electronics & Mobiles"
                  value={newStoreForm.name}
                  onChange={(e) => setNewStoreForm({ ...newStoreForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newStoreForm.category}
                    onChange={(e) => setNewStoreForm({ ...newStoreForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Market / Location *</label>
                  <select
                    value={newStoreForm.market}
                    onChange={(e) => setNewStoreForm({ ...newStoreForm, market: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                  >
                    {markets.map((m, idx) => {
                      const name = typeof m === 'object' ? (m.name || m.id) : m;
                      return <option key={idx} value={name}>{name}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={newStoreForm.phone}
                    onChange={(e) => setNewStoreForm({ ...newStoreForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Lead Number</label>
                  <input
                    type="text"
                    placeholder="919876543210"
                    value={newStoreForm.whatsapp}
                    onChange={(e) => setNewStoreForm({ ...newStoreForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Address</label>
                <input
                  type="text"
                  placeholder="Shop No. 12, Main Market Road, City Center"
                  value={newStoreForm.address}
                  onChange={(e) => setNewStoreForm({ ...newStoreForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe your shop specialties..."
                  value={newStoreForm.description}
                  onChange={(e) => setNewStoreForm({ ...newStoreForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateWizard(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Store...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket"></i> Launch Storefront
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy M16 5G (6GB RAM, 128GB)"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={productForm.categoryName}
                    onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value, category: e.target.value.toLowerCase() })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="14999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="18999"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Multiple Product Photos Uploader */}
              <ImageUploader
                label="Product Photos (Select Multiple)"
                multiple={true}
                values={productForm.images || []}
                onImagesChange={(newImgs) => setProductForm({ ...productForm, images: newImgs })}
                aspectRatio="square"
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Stock Availability</label>
                <select
                  value={productForm.stockStatus}
                  onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Highlights (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Year Warranty, 50MP Camera, 6000mAh Battery"
                  value={productForm.highlights}
                  onChange={(e) => setProductForm({ ...productForm, highlights: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed product specifications and features..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingProduct ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i> {modalMode === 'add' ? 'Save & Add Product' : 'Update Product'}
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
