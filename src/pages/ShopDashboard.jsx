import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AdminShopTopBanner from '../components/dashboard/AdminShopTopBanner';
import DeleteProductModal from '../components/dashboard/DeleteProductModal';
import ProductFormModal from '../components/dashboard/ProductFormModal';
import ShopAdminNotice from '../components/dashboard/ShopAdminNotice';
import ShopCreateForm from '../components/dashboard/ShopCreateForm';
import ShopCreateWizardModal from '../components/dashboard/ShopCreateWizardModal';
import ShopHeaderBanner from '../components/dashboard/ShopHeaderBanner';
import ShopNavTabs from '../components/dashboard/ShopNavTabs';
import ShopOverviewTab from '../components/dashboard/ShopOverviewTab';
import ShopProductsTab from '../components/dashboard/ShopProductsTab';
import ShopQRCodeTab from '../components/dashboard/ShopQRCodeTab';
import ShopSettingsTab from '../components/dashboard/ShopSettingsTab';
import { DashboardStatsSkeleton, TableSkeleton } from '../components/Skeletons';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_COVER_BANNER, DEFAULT_PRODUCT_IMAGE, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function ShopDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const {
    shops,
    products,
    createShop,
    updateShopDetails,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    markets,
    cities,
    isDataLoading
  } = useBazaar();



  const [toastMessage, setToastMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [activeTab, setActiveTab] = useState('overview');

  // Find shop owned by current logged in user (by ownerUid, profile shopId, or ownerEmail)
  const userShop = shops.find(s =>
    (userProfile?.uid && s.ownerUid === userProfile.uid) ||
    (userProfile?.shopId && s.id === userProfile.shopId) ||
    (userProfile?.email && s.ownerEmail && s.ownerEmail.toLowerCase() === userProfile.email.toLowerCase())
  );

  // Shop Creation Wizard State
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [creating, setCreating] = useState(false);

  // Auto-close creation wizard when user's Shop is loaded/found
  useEffect(() => {
    if (userShop) {
      setShowCreateWizard(false);
    }
  }, [userShop?.id]);

  const [newStoreForm, setNewStoreForm] = useState({
    name: '',
    city: 'Rampur',
    category: '',
    market: '',
    phone: '',
    whatsapp: '',
    timing: '10:00 AM - 9:00 PM',
    address: '',
    description: '',
    image: DEFAULT_STORE_LOGO,
    banner: DEFAULT_COVER_BANNER
  });

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!newStoreForm.name?.trim()) {
      showToast("Please enter a valid shop / business name.", "error");
      return;
    }
    if (!newStoreForm.category) {
      showToast("Please select a business category.", "error");
      return;
    }
    if (!newStoreForm.market) {
      showToast("Please select a market location.", "error");
      return;
    }
    if (!newStoreForm.phone?.trim()) {
      showToast("Please enter a contact phone number.", "error");
      return;
    }
    if (!newStoreForm.whatsapp?.trim()) {
      showToast("Please enter a WhatsApp number for receiving customer orders.", "error");
      return;
    }
    if (!newStoreForm.address?.trim()) {
      showToast("Please enter the shop's physical address.", "error");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        ...newStoreForm,
        image: newStoreForm.image || DEFAULT_STORE_LOGO,
        banner: newStoreForm.banner || DEFAULT_COVER_BANNER,
        timing: newStoreForm.timing || '10:00 AM - 9:00 PM'
      };
      const created = await createShop(payload, userProfile);
      setCreating(false);
      setShowCreateWizard(false);
      showToast(`Storefront "${created.name}" launched successfully!`);
    } catch (err) {
      console.error("Error creating shop:", err);
      setCreating(false);
      showToast("Failed to create storefront. Please try again.", "error");
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const [adminSelectedShopId, setAdminSelectedShopId] = useState('');

  // Active shop resolution (Admin can select any shop to manage/inspect, Merchant uses userShop)
  const shop = isAdmin
    ? (shops.find(s => s.id === adminSelectedShopId) || null)
    : (userShop || null);

  // Filter products belonging to this active shop
  const shopProducts = shop ? products.filter(p => p.shopId === shop.id) : [];

  // ── Shop Form State ──
  const [storeForm, setStoreForm] = useState({
    name: shop?.name || '',
    city: shop?.city || 'Rampur',
    category: shop?.category || 'Electronics',
    market: shop?.market || 'Main Market',
    phone: shop?.phone || '',
    whatsapp: shop?.whatsapp || '',
    timing: shop?.timing || '10:00 AM - 9:00 PM',
    address: shop?.address || '',
    description: shop?.description || '',
    image: shop?.image || DEFAULT_STORE_LOGO,
    banner: shop?.banner || DEFAULT_COVER_BANNER
  });

  const [savingStore, setSavingStore] = useState(false);

  useEffect(() => {
    if (shop) {
      setStoreForm({
        name: shop.name || '',
        city: shop.city || 'Rampur',
        category: shop.category || 'Electronics',
        market: shop.market || 'Main Market',
        phone: shop.phone || '',
        whatsapp: shop.whatsapp || '',
        timing: shop.timing || '10:00 AM - 9:00 PM',
        address: shop.address || '',
        description: shop.description || '',
        image: shop.image || DEFAULT_STORE_LOGO,
        banner: shop.banner || DEFAULT_COVER_BANNER
      });
    }
  }, [shop?.id]);

  const handleSaveStoreProfile = async (e) => {
    e.preventDefault();
    if (!shop) return;
    setSavingStore(true);
    try {
      await updateShopDetails(shop.id, storeForm);
      setSavingStore(false);
      showToast("Storefront profile details updated successfully!");
    } catch (err) {
      console.error("Error saving shop profile:", err);
      setSavingStore(false);
      showToast("Could not update Shop profile.", "error");
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
    stockStatus: 'In Stock', status: 'Active',
    isDealOfDay: false
  });

  if (isDataLoading || authLoading) {
    return (
      <DashboardLayout activeItem="dashboard">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="h-28 bg-slate-200 rounded-3xl animate-pulse" />
          <DashboardStatsSkeleton count={3} />
          <TableSkeleton rows={5} />
        </div>
      </DashboardLayout>
    );
  }

  const openAddModal = () => {
    setModalMode('add');
    setProductForm({
      name: '', brand: '', price: '', originalPrice: '',
      category: 'electronics', categoryName: 'Electronics',
      description: '',
      images: [],
      highlights: 'Original Warranty, Local Shop Delivery',
      stockStatus: 'In Stock', status: 'Active',
      isDealOfDay: false
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
      status: product.status || 'Active',
      isDealOfDay: product.isDealOfDay || false
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);

    const highlightsArr = productForm.highlights
      ? productForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: productForm.name,
      brand: productForm.brand || '',
      price: Number(productForm.price) || 0,
      originalPrice: Number(productForm.originalPrice || productForm.price) || 0,
      category: productForm.category || 'electronics',
      categoryName: productForm.categoryName || 'Electronics',
      description: productForm.description || '',
      images: productForm.images && productForm.images.length > 0 ? productForm.images : [DEFAULT_PRODUCT_IMAGE],
      highlights: highlightsArr,
      stockStatus: productForm.stockStatus || 'In Stock',
      status: productForm.status || 'Active',
      isDealOfDay: productForm.isDealOfDay || false,
      shopId: shop?.id || '',
      shopName: shop?.name || ''
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

  const totalCatalogValue = shopProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const storeVisits = shop?.viewCount || 0;

  const stats = [
    { label: 'Total Products', value: shopProducts.length, icon: 'fa-box-open', color: 'bg-emerald-50 text-[#056839]', trend: 'Live Catalog' },
    { label: 'Store Visits', value: storeVisits.toLocaleString('en-IN'), icon: 'fa-eye', color: 'bg-violet-50 text-violet-600', trend: 'Total Views' },
    { label: 'Store Rating', value: `${shop?.rating || 5.0} ★`, icon: 'fa-star', color: 'bg-amber-50 text-amber-500', trend: `${shop?.reviewsCount || 0} Reviews` },
    { label: 'Inventory Value', value: `₹${totalCatalogValue > 1000 ? `${(totalCatalogValue / 1000).toFixed(1)}k` : totalCatalogValue.toLocaleString('en-IN')}`, icon: 'fa-indian-rupee-sign', color: 'bg-blue-50 text-blue-600', trend: 'Active Catalog' },
  ];

  return (
    <DashboardLayout title="Shop Management" role="shop">

      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce ${toastMessage.type === 'error'
          ? 'bg-rose-950 text-rose-200 border-rose-800'
          : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}>
          <i className={`fa-solid ${toastMessage.type === 'error' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-check text-emerald-400'} text-base`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in pb-12">

        {/* ── Case 1: No Shop Active (Admin Notice or Merchant Creation Form) ── */}
        {!shop ? (
          isAdmin ? (
            <ShopAdminNotice
              adminSelectedShopId={adminSelectedShopId}
              setAdminSelectedShopId={setAdminSelectedShopId}
              shops={shops}
            />
          ) : (
            <ShopCreateForm
              newStoreForm={newStoreForm}
              setNewStoreForm={setNewStoreForm}
              handleCreateShop={handleCreateShop}
              creating={creating}
              categories={categories}
              markets={markets}
              cities={cities}
            />
          )
        ) : (
          /* ── Case 2: Active Shop Dashboard Display ── */
          <>
            {/* Admin inspection top banner */}
            {isAdmin && (
              <AdminShopTopBanner
                shopName={shop.name}
                onClear={() => setAdminSelectedShopId('')}
              />
            )}

            {/* Unverified Shop Banner */}
            {!shop.verified && (
              <div className="bg-amber-950/90 border border-amber-800 text-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-lg animate-fade-in">
                <i className="fa-solid fa-shield-halved text-amber-400 text-lg mt-0.5 flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <strong className="text-xs sm:text-sm font-black block text-amber-100">Verification Pending — Hidden from Public Buyers</strong>
                  <p className="text-[11px] text-amber-300/90 font-medium mt-0.5 leading-relaxed">
                    Your Shop status is currently <strong>Unverified / Pending Review</strong>. Admin has complete control over storefront listings. Once verified by Admin, your Shop and catalog will publish automatically to public buyers.
                  </p>
                </div>
              </div>
            )}

            {/* Shop Header Banner — 100% Flush to Screen Edges */}
            <div className="-mx-3.5 -mt-3.5 sm:-mx-5 sm:-mt-5 md:-mx-6 md:-mt-6">
              <ShopHeaderBanner
                shop={shop}
                onOpenSettings={() => setActiveTab('store')}
                onAddProduct={openAddModal}
                onOpenQRCode={() => setActiveTab('qrcode')}
              />
            </div>

            {/* Navigation Tabs */}
            <ShopNavTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              catalogCount={shopProducts.length}
            />

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <ShopOverviewTab
                stats={stats}
                shopProducts={shopProducts}
                onViewAllProducts={() => setActiveTab('products')}
                onAddFirstProduct={openAddModal}
                shop={shop}
                onEditProfile={() => setActiveTab('store')}
                onViewQRCode={() => setActiveTab('qrcode')}
              />
            )}

            {/* Tab 2: Catalog Products */}
            {activeTab === 'products' && (
              <ShopProductsTab
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                filteredProducts={filteredProducts}
                onAddProduct={openAddModal}
                onToggleStock={handleToggleStock}
                onEditProduct={openEditModal}
                onDeleteProduct={(p) => setProductToDelete(p)}
              />
            )}

            {/* Tab 3: Shop QR Code */}
            {activeTab === 'qrcode' && (
              <ShopQRCodeTab
                shop={shop}
                showToast={showToast}
              />
            )}

            {/* Tab 4: Shop Profile Settings */}
            {activeTab === 'store' && (
              <ShopSettingsTab
                storeForm={storeForm}
                setStoreForm={setStoreForm}
                handleSaveStoreProfile={handleSaveStoreProfile}
                savingStore={savingStore}
                categories={categories}
                markets={markets}
                cities={cities}
              />
            )}
          </>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        productToDelete={productToDelete}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        deleting={deleting}
      />

      {/* Shop Creation Wizard Modal */}
      <ShopCreateWizardModal
        showCreateWizard={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        newStoreForm={newStoreForm}
        setNewStoreForm={setNewStoreForm}
        handleCreateShop={handleCreateShop}
        creating={creating}
        categories={categories}
        markets={markets}
        cities={cities}
      />

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        showProductModal={showProductModal}
        onClose={() => setShowProductModal(false)}
        modalMode={modalMode}
        productForm={productForm}
        setProductForm={setProductForm}
        handleProductSubmit={handleProductSubmit}
        savingProduct={savingProduct}
        categories={categories}
      />

    </DashboardLayout>
  );
}
