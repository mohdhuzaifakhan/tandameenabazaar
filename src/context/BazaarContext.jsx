import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { APP_CONFIG, FIRESTORE_COLLECTIONS, STORAGE_KEYS } from '../constants/appConstants';
import { BAZAAR_DATA } from '../data';
import { db, isFirebaseConfigured } from '../firebase';
import { DEFAULT_COVER_BANNER, DEFAULT_PRODUCT_IMAGE, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

const BazaarContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: "fashion", name: "Fashion & Suits", icon: "fa-shirt", description: "Apparel, sarees, suits, bridal wear, and garments" },
  { id: "electronics", name: "Electronics", icon: "fa-laptop", description: "Mobile phones, laptops, TVs, and gadgets" },
  { id: "mobile-acc", name: "Mobile & Accessories", icon: "fa-mobile-screen-button", description: "Cases, chargers, earphones, and accessories" },
  { id: "groceries", name: "Groceries & Spices", icon: "fa-basket-shopping", description: "Daily essentials, spices, dry fruits, and provisions" },
  { id: "footwear", name: "Footwear & Shoes", icon: "fa-shoe-prints", description: "Shoes, sandals, heels, and traditional footwear" },
  { id: "cosmetics", name: "Cosmetics & Beauty", icon: "fa-spray-can-sparkles", description: "Beauty products, perfumes, makeup, and care" },
  { id: "furniture", name: "Home & Furniture", icon: "fa-couch", description: "Home decor, brassware, tables, and wooden furniture" },
  { id: "jewellery", name: "Jewellery & Watches", icon: "fa-gem", description: "Gold, silver, artificial jewellery, and watches" },
  { id: "books", name: "Books & Stationery", icon: "fa-book", description: "Educational books, notebooks, and office supplies" },
  { id: "toys", name: "Toys & Baby Care", icon: "fa-gamepad", description: "Toys, games, strollers, and baby products" },
  { id: "sports", name: "Sports & Fitness", icon: "fa-volleyball", description: "Sports gear, gym equipment, and activewear" },
  { id: "sweets", name: "Sweets & Bakery", icon: "fa-cookie", description: "Mithai, traditional Rampur delicacies, and bakery" },
  { id: "health", name: "Health & Wellness", icon: "fa-briefcase-medical", description: "Pharmacy items, supplements, and Ayurvedic products" },
  { id: "automotive", name: "Automotive & Hardware", icon: "fa-car", description: "Vehicle accessories, spare parts, and tools" }
];

const getMergedCategories = (saved) => {
  if (!Array.isArray(saved) || saved.length === 0) return DEFAULT_CATEGORIES;
  const existingIds = new Set(saved.map(c => c.id || c.name?.toLowerCase()));
  const missingDefaults = DEFAULT_CATEGORIES.filter(def => !existingIds.has(def.id));
  return [...saved, ...missingDefaults];
};


const normalizeMarkets = (saved) => {
  if (!Array.isArray(saved)) return [];

  return saved.map((m, idx) => {
    if (typeof m === 'string') {
      return {
        id: m.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: m,
        city: 'Rampur',
        area: 'Main City Area',
        description: 'Popular retail market hub for local shopping.'
      };
    }
    return {
      id: m.id || (m.name ? m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `mkt-${idx}`),
      name: m.name || m.id || 'Local Market',
      city: m.city || 'Rampur',
      area: m.area || m.city || 'Main City Area',
      description: m.description || `Market location in ${m.city || 'Rampur'}.`
    };
  });
};

const DEFAULT_BANNERS = [
  {
    id: 'banner-1',
    type: 'special_offer',
    tag: 'SPECIAL OFFER',
    title: 'Smartwatch Series 9',
    subtitle: 'Advanced performance, vibrant OLED display, and all-day health tracking.',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=85',
    bgColor: 'bg-[#eaf5ef]',
    borderColor: 'border-emerald-100/90',
    tagColor: 'text-[#056839]',
    btnBg: 'bg-[#056839]',
    link: '/categories',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-2',
    type: 'special_offer',
    tag: 'MEGA DEAL',
    title: 'Wireless Headphones Pro',
    subtitle: 'Active noise cancellation, studio acoustic acoustics, and 30hr battery.',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
    bgColor: 'bg-[#eef2ff]',
    borderColor: 'border-indigo-100',
    tagColor: 'text-indigo-700',
    btnBg: 'bg-indigo-700',
    link: '/categories',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-3',
    type: 'new_arrival',
    tag: 'NEW ARRIVAL',
    title: 'Ethnic & Festive Collection',
    subtitle: 'Explore authentic designer wear, Zardozi dupattas, and bridal fashion.',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85',
    bgColor: 'bg-[#f4efe8]',
    borderColor: 'border-amber-200/60',
    tagColor: 'text-amber-800',
    btnBg: 'bg-[#056839]',
    link: '/categories',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const BazaarProvider = ({ children }) => {
  // Helper for safe localStorage access
  const safeGetItem = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return fallback;
    }
  };

  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  };

  // Real Products State
  const [products, setProducts] = useState(() => safeGetItem(STORAGE_KEYS.PRODUCTS, BAZAAR_DATA.products || []));

  // Real Shops State
  const [shops, setShops] = useState(() => safeGetItem(STORAGE_KEYS.SHOPS, BAZAAR_DATA.shops || []));

  // Dynamic Categories State
  const [categories, setCategories] = useState(() => getMergedCategories(safeGetItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)));

  // Dynamic Markets / Locations State
  const [markets, setMarkets] = useState(() => normalizeMarkets(safeGetItem(STORAGE_KEYS.MARKETS, [])));

  // Dynamic Advertisements / Banners State
  const [banners, setBanners] = useState(() => safeGetItem(STORAGE_KEYS.BANNERS, DEFAULT_BANNERS));

  // Saved Products Wishlist State
  const [savedProductIds, setSavedProductIds] = useState(() => safeGetItem(STORAGE_KEYS.SAVED_PRODUCTS, []));

  // Followed Shops State
  const [followedShopIds, setFollowedShopIds] = useState(() => safeGetItem(STORAGE_KEYS.FOLLOWED_SHOPS, []));

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => safeGetItem(STORAGE_KEYS.USER_PROFILE, { role: 'guest' }));

  // Data Loading State for Skeleton Loading Indicators across the app
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Active City
  const [currentCity, setCurrentCity] = useState(() => safeGetItem(STORAGE_KEYS.CITY, APP_CONFIG.DEFAULT_CITY));

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CITY, currentCity);
  }, [currentCity]);

  // Initial loading completion timer / snapshot ready flag
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // ── REAL FIREBASE FIRESTORE SYNC (DYNAMIC REAL-TIME DATA) ──
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsDataLoading(false);
      return;
    }

    let loadedCount = 0;
    const markLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setIsDataLoading(false);
      }
    };

    // 1. Sync Real Shops Collection
    const shopsUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.SHOPS), (snapshot) => {
      const loadedShops = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => !s.deleted);
      setShops(loadedShops);
      markLoaded();
    }, (err) => {
      console.warn("Firestore shops snapshot error:", err);
      markLoaded();
    });

    // 2. Sync Real Products Collection
    const productsUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.PRODUCTS), (snapshot) => {
      const loadedProds = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => !p.deleted);
      setProducts(loadedProds);
      markLoaded();
    }, (err) => {
      console.warn("Firestore products snapshot error:", err);
      markLoaded();
    });

    // 3. Sync Dynamic Categories Collection
    const categoriesUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES), (snapshot) => {
      const loadedCats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(c => !c.deleted);
      if (loadedCats.length > 0) {
        setCategories(getMergedCategories(loadedCats));
      } else {
        // Seed default categories if collection is empty
        DEFAULT_CATEGORIES.forEach(cat => {
          setDoc(doc(db, FIRESTORE_COLLECTIONS.CATEGORIES, cat.id), cat, { merge: true }).catch(err => console.warn("Error seeding category:", err));
        });
      }
    }, (err) => console.warn("Firestore categories snapshot error:", err));

    // 4. Sync Dynamic Markets / Locations Collection
    const marketsUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.MARKETS), (snapshot) => {
      const loadedMkts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => !m.deleted);
      setMarkets(normalizeMarkets(loadedMkts));
    }, (err) => console.warn("Firestore markets snapshot error:", err));

    // 5. Sync Dynamic Advertisements / Banners Collection
    const bannersUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.BANNERS), (snapshot) => {
      const loadedBanners = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => !b.deleted);
      if (loadedBanners.length > 0) {
        setBanners(loadedBanners);
      } else {
        // Seed default banners if collection is empty
        DEFAULT_BANNERS.forEach(banner => {
          setDoc(doc(db, FIRESTORE_COLLECTIONS.BANNERS, banner.id), banner, { merge: true }).catch(err => console.warn("Error seeding banner:", err));
        });
      }
    }, (err) => console.warn("Firestore banners snapshot error:", err));

    return () => {
      shopsUnsub();
      productsUnsub();
      categoriesUnsub();
      marketsUnsub();
      bannersUnsub();
    };
  }, []);

  // Sync real state to localStorage safely
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SHOPS, shops);
  }, [shops]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.MARKETS, markets);
  }, [markets]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.BANNERS, banners);
  }, [banners]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SAVED_PRODUCTS, savedProductIds);
  }, [savedProductIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.FOLLOWED_SHOPS, followedShopIds);
  }, [followedShopIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.USER_PROFILE, currentUser);
  }, [currentUser]);

  // --- BANNER ACTIONS (ADMIN ONLY) ---
  const addBanner = async (bannerData) => {
    const id = bannerData.id || `banner-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newBanner = {
      id,
      type: bannerData.type || 'special_offer',
      tag: bannerData.tag || 'SPECIAL OFFER',
      title: bannerData.title || 'New Offer',
      subtitle: bannerData.subtitle || '',
      discount: bannerData.discount || '15% OFF',
      image: bannerData.image || DEFAULT_PRODUCT_IMAGE,
      bgColor: bannerData.bgColor || 'bg-[#eaf5ef]',
      borderColor: bannerData.borderColor || 'border-emerald-100/90',
      tagColor: bannerData.tagColor || 'text-[#056839]',
      btnBg: bannerData.btnBg || 'bg-[#056839]',
      link: bannerData.link || '/categories',
      active: bannerData.active !== false,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setBanners(prev => {
      const updatedList = [newBanner, ...prev];
      safeSetItem(STORAGE_KEYS.BANNERS, updatedList);
      return updatedList;
    });

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.BANNERS, id), newBanner, { merge: true });
      } catch (e) {
        console.warn("Error adding banner to Firestore:", e);
      }
    }
    return newBanner;
  };

  const updateBanner = async (bannerId, updatedData) => {
    const nowIso = new Date().toISOString();
    let fullUpdatedDoc = null;

    setBanners(prev => {
      const updatedList = prev.map(b => {
        if (b.id === bannerId) {
          fullUpdatedDoc = { ...b, ...updatedData, updatedAt: nowIso };
          return fullUpdatedDoc;
        }
        return b;
      });
      safeSetItem(STORAGE_KEYS.BANNERS, updatedList);
      return updatedList;
    });

    if (isFirebaseConfigured && fullUpdatedDoc) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.BANNERS, bannerId), fullUpdatedDoc, { merge: true });
      } catch (e) {
        console.warn("Error updating banner in Firestore:", e);
      }
    }
  };

  const toggleBannerActive = async (bannerId) => {
    const banner = banners.find(b => b.id === bannerId);
    if (!banner) return;

    const updatedActive = !(banner.active !== false);
    await updateBanner(bannerId, { active: updatedActive });
  };

  const deleteBanner = async (bannerId) => {
    setBanners(prev => {
      const updatedList = prev.filter(b => b.id !== bannerId);
      safeSetItem(STORAGE_KEYS.BANNERS, updatedList);
      return updatedList;
    });

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.BANNERS, bannerId), { deleted: true, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {
        console.warn("Error deleting banner in Firestore:", e);
      }
    }
  };

  // Actions
  const isProductSaved = (productId) => savedProductIds.includes(productId);

  const toggleSaveProduct = (productId) => {
    setSavedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const clearSavedProducts = () => {
    setSavedProductIds([]);
  };

  const isShopFollowed = (shopId) => followedShopIds.includes(shopId);

  const toggleFollowShop = (shopId) => {
    setFollowedShopIds(prev =>
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };

  // Create New Shop Storefront in State and Firestore
  const createShop = async (shopData, userProfile = null) => {
    const userUid = typeof userProfile === 'string' ? userProfile : userProfile?.uid;
    const userEmail = typeof userProfile === 'object' ? userProfile?.email : null;

    const shopId = shopData.id || (shopData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900));

    // Resolve category ID & Name from categories list
    const rawCat = shopData.category || 'Electronics';
    const matchedCategory = categories.find(
      c => c.id === rawCat || c.id === shopData.categoryId || c.name.toLowerCase() === rawCat.toLowerCase()
    );
    const categoryId = matchedCategory ? matchedCategory.id : rawCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryName = matchedCategory ? matchedCategory.name : (shopData.categoryName || rawCat);

    const newShop = {
      id: shopId,
      name: shopData.name,
      city: shopData.city || currentCity || 'Rampur',
      category: categoryId,
      categoryName: categoryName,
      market: shopData.market || 'Main Market',
      location: shopData.location || shopData.market || 'Main Market',
      phone: shopData.phone || '',
      whatsapp: shopData.whatsapp || shopData.phone?.replace(/[^0-9]/g, '') || '',
      rating: 5.0,
      reviewsCount: 0,
      productsCount: 0,
      verified: true,
      ownerUid: userUid || '',
      ownerEmail: userEmail || '',
      timing: shopData.timing || '10:00 AM - 9:00 PM',
      address: shopData.address || '',
      description: shopData.description || '',
      image: shopData.image || DEFAULT_STORE_LOGO,
      banner: shopData.banner || DEFAULT_COVER_BANNER,
      createdAt: new Date().toISOString()
    };

    setShops(prev => [newShop, ...prev.filter(s => s.id !== shopId)]);

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, 'shops', shopId);
        await setDoc(shopRef, newShop, { merge: true });

        if (userUid) {
          const userRef = doc(db, 'users', userUid);
          await setDoc(userRef, {
            role: 'shop_owner',
            shopId: shopId,
            shopName: newShop.name,
            ownerEmail: userEmail
          }, { merge: true });
        }
      } catch (err) {
        console.warn("Could not save new shop to Firestore:", err);
      }
    }

    return newShop;
  };

  // Update Shop Profile in State and Firestore
  const updateShopDetails = async (shopId, updatedData) => {
    let resolvedData = { ...updatedData };
    if (resolvedData.category) {
      const matchedCategory = categories.find(
        c => c.id === resolvedData.category || c.name.toLowerCase() === resolvedData.category.toLowerCase()
      );
      if (matchedCategory) {
        resolvedData.category = matchedCategory.id;
        resolvedData.categoryName = matchedCategory.name;
      } else if (!resolvedData.categoryName) {
        resolvedData.categoryName = resolvedData.category;
      }
    }

    setShops(prevShops => {
      const exists = prevShops.some(s => s.id === shopId);
      if (exists) {
        return prevShops.map(s => (s.id === shopId ? { ...s, ...resolvedData } : s));
      } else {
        return [{ id: shopId, name: 'My Storefront', ...resolvedData }, ...prevShops];
      }
    });

    if (resolvedData.name) {
      setProducts(prevProducts =>
        prevProducts.map(p => (p.shopId === shopId ? { ...p, shopName: resolvedData.name } : p))
      );
    }

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, 'shops', shopId);
        await setDoc(shopRef, resolvedData, { merge: true });
      } catch (err) {
        console.warn("Could not update shop details in Firestore:", err);
      }
    }
  };

  const addProduct = async (productData) => {
    if (!productData) return;
    const nameSlug = productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    const id = productData.id || (nameSlug + '-' + Math.floor(100 + Math.random() * 900));

    const finalImages = productData.images && productData.images.length > 0
      ? productData.images
      : (productData.image ? [productData.image] : [DEFAULT_PRODUCT_IMAGE]);

    const newProduct = {
      ...productData,
      id,
      name: productData.name || 'Untitled Product',
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice || productData.price) || 0,
      isNew: true,
      isFeatured: false,
      rating: productData.rating || 4.5,
      reviewsCount: productData.reviewsCount || 1,
      soldCount: productData.soldCount || 0,
      images: finalImages,
      image: finalImages[0],
      highlights: productData.highlights || [],
      specifications: productData.specifications || {}
    };

    setProducts(prev => [newProduct, ...prev.filter(p => p.id !== id)]);

    setShops(prevShops => prevShops.map(s => {
      if (s.id === productData.shopId) {
        return { ...s, productsCount: (s.productsCount || 0) + 1 };
      }
      return s;
    }));

    if (isFirebaseConfigured) {
      try {
        const productRef = doc(db, 'products', id);
        await setDoc(productRef, newProduct, { merge: true });
      } catch (err) {
        console.warn("Could not add product to Firestore:", err);
      }
    }

    return newProduct;
  };

  const updateProduct = async (updatedProduct) => {
    if (!updatedProduct || !updatedProduct.id) return;

    const finalImages = updatedProduct.images && updatedProduct.images.length > 0
      ? updatedProduct.images
      : (updatedProduct.image ? [updatedProduct.image] : [DEFAULT_PRODUCT_IMAGE]);

    const cleanProduct = {
      ...updatedProduct,
      price: Number(updatedProduct.price) || 0,
      originalPrice: Number(updatedProduct.originalPrice || updatedProduct.price) || 0,
      images: finalImages,
      image: finalImages[0]
    };

    setProducts(prev => prev.map(p => p.id === cleanProduct.id ? { ...p, ...cleanProduct } : p));

    if (isFirebaseConfigured) {
      try {
        const productRef = doc(db, 'products', cleanProduct.id);
        await setDoc(productRef, cleanProduct, { merge: true });
      } catch (err) {
        console.warn("Could not update product in Firestore:", err);
      }
    }
  };

  const deleteProduct = async (productId) => {
    const targetProd = products.find(p => p.id === productId);

    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      safeSetItem(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });

    setSavedProductIds(prev => {
      const updated = prev.filter(id => id !== productId);
      safeSetItem(STORAGE_KEYS.SAVED_PRODUCTS, updated);
      return updated;
    });

    if (targetProd?.shopId) {
      setShops(prevShops => prevShops.map(s => {
        if (s.id === targetProd.shopId) {
          return { ...s, productsCount: Math.max(0, (s.productsCount || 1) - 1) };
        }
        return s;
      }));
    }

    if (isFirebaseConfigured) {
      try {
        const productRef = doc(db, FIRESTORE_COLLECTIONS.PRODUCTS, productId);
        await setDoc(productRef, { deleted: true }, { merge: true });
        await deleteDoc(productRef).catch(e => console.warn("deleteDoc product error:", e));
      } catch (err) {
        console.warn("Could not delete product in Firestore:", err);
      }
    }
  };

  const toggleShopVerification = async (shopId) => {
    let newStatus = false;
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        newStatus = !s.verified;
        return { ...s, verified: newStatus };
      }
      return s;
    }));

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, FIRESTORE_COLLECTIONS.SHOPS, shopId);
        await setDoc(shopRef, { verified: newStatus }, { merge: true });
      } catch (err) {
        console.warn("Could not update verification status in Firestore:", err);
      }
    }
  };

  const deleteShop = async (shopId) => {
    setShops(prev => {
      const updated = prev.filter(s => s.id !== shopId);
      safeSetItem(STORAGE_KEYS.SHOPS, updated);
      return updated;
    });

    const shopProdIds = new Set(products.filter(p => p.shopId === shopId).map(p => p.id));
    setProducts(prev => {
      const updated = prev.filter(p => p.shopId !== shopId);
      safeSetItem(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });

    setSavedProductIds(prev => {
      const updated = prev.filter(id => !shopProdIds.has(id));
      safeSetItem(STORAGE_KEYS.SAVED_PRODUCTS, updated);
      return updated;
    });

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, FIRESTORE_COLLECTIONS.SHOPS, shopId);
        await setDoc(shopRef, { deleted: true }, { merge: true });
        await deleteDoc(shopRef).catch(e => console.warn("deleteDoc shop error:", e));

        shopProdIds.forEach(async (pId) => {
          const pRef = doc(db, FIRESTORE_COLLECTIONS.PRODUCTS, pId);
          await setDoc(pRef, { deleted: true }, { merge: true });
          await deleteDoc(pRef).catch(() => { });
        });
      } catch (err) {
        console.warn("Could not delete shop in Firestore:", err);
      }
    }
  };

  // ── DYNAMIC CATEGORY & MARKET CRUD HANDLERS ──
  const addCategory = async (catData) => {
    if (!catData || !catData.name) return;
    const id = catData.id || catData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      id,
      name: catData.name.trim(),
      icon: catData.icon || 'fa-shapes',
      description: catData.description || '',
      color: catData.color || 'bg-emerald-100 text-[#056839]',
      createdAt: new Date().toISOString()
    };

    setCategories(prev => [newCategory, ...prev.filter(c => c.id !== id)]);

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'categories', id), newCategory, { merge: true });
      } catch (err) {
        console.warn("Could not save category to Firestore:", err);
      }
    }
    return newCategory;
  };

  const updateCategory = async (catId, updatedData) => {
    if (!catId) return;
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...updatedData } : c));

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'categories', catId), updatedData, { merge: true });
      } catch (err) {
        console.warn("Could not update category in Firestore:", err);
      }
    }
  };

  const deleteCategory = async (catId) => {
    if (!catId) return;
    setCategories(prev => prev.filter(c => c.id !== catId));

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'categories', catId), { deleted: true }, { merge: true });
      } catch (err) {
        console.warn("Could not delete category in Firestore:", err);
      }
    }
  };

  const addMarket = async (mktData) => {
    if (!mktData || !mktData.name) return;
    const id = mktData.id || mktData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const newMarket = {
      id,
      name: mktData.name.trim(),
      city: mktData.city || 'Rampur',
      area: mktData.area || 'Main City Area',
      description: mktData.description || '',
      createdAt: new Date().toISOString()
    };

    setMarkets(prev => [newMarket, ...prev.filter(m => m.id !== id)]);

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'markets', id), newMarket, { merge: true });
      } catch (err) {
        console.warn("Could not save market to Firestore:", err);
      }
    }
    return newMarket;
  };

  const updateMarket = async (mktId, updatedData) => {
    if (!mktId) return;
    setMarkets(prev => prev.map(m => m.id === mktId ? { ...m, ...updatedData } : m));

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'markets', mktId), updatedData, { merge: true });
      } catch (err) {
        console.warn("Could not update market in Firestore:", err);
      }
    }
  };

  const deleteMarket = async (mktId) => {
    if (!mktId) return;
    setMarkets(prev => prev.filter(m => m.id !== mktId));

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'markets', mktId), { deleted: true }, { merge: true });
      } catch (err) {
        console.warn("Could not delete market in Firestore:", err);
      }
    }
  };

  const login = (email, password) => {
    const adminEmail = (APP_CONFIG.ADMIN_EMAIL || 'mohdhuzaifa8126195456@gmail.com').toLowerCase().trim();
    if (email?.toLowerCase().trim() === adminEmail && password === 'admin123') {
      setCurrentUser({ role: 'admin', email });
      return { success: true, redirect: '/dashboard/admin' };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => {
    setCurrentUser({ role: 'guest' });
  };

  const generateWhatsAppLink = (product, shop) => {
    if (!product) return '';
    const rawPhone = shop ? (shop.whatsapp || shop.phone) : (product.shopWhatsapp || product.shopPhone || '');
    let cleanPhone = (rawPhone || "").replace(/[^0-9]/g, '');

    // Format 10-digit Indian numbers with '91' country code for WhatsApp link compatibility
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    // Fallback to central marketplace support line if no phone is specified
    if (!cleanPhone) {
      cleanPhone = '918433043426';
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${baseUrl}/product/${product.id}`;

    // Only include a photo link if it's a real hosted URL (not a base64 data URI)
    const rawImg = product.images && product.images.length > 0 ? product.images[0] : (product.image || '');
    const hostedImg = rawImg && rawImg.startsWith('http') ? rawImg : '';

    const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
    const discountText = hasDiscount
      ? ` (MRP: ₹${product.originalPrice?.toLocaleString('en-IN')} - ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)`
      : '';

    const text = ` *NEW ORDER INQUIRY - MEENA BAZAAR*\n\n` +
      `  *Product Details:*\n` +
      `• *Item Name:* ${product.name}\n` +
      `• *Selling Price:* ₹${product.price?.toLocaleString('en-IN')}${discountText}\n` +
      (product.brand ? `• *Brand:* ${product.brand}\n` : '') +
      (product.categoryName || product.category ? `• *Category:* ${product.categoryName || product.category}\n` : '') +
      `• *Availability:* ${product.stockStatus || 'In Stock'}\n` +
      `• *Product ID:* ${product.id}\n\n` +
      (shop ? ` *Store Info:*\n• *Shop Name:* ${shop.name}\n• *Location:* ${shop.market || 'Local Market'}, ${shop.city || 'Rampur'}\n\n` : '') +
      (hostedImg ? ` *Product Photo:*\n${hostedImg}\n\n` : '') +
      ` *Hello! I want to order this product from your shop on Meena Bazaar. Please confirm availability and delivery details.*`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const openWhatsApp = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const shop = shops.find(s => s.id === product.shopId);
    const link = generateWhatsAppLink(product, shop);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // ── ANALYTICS: derived from live products/shops viewCount ──
  const topViewedProducts = [...products]
    .filter(p => (p.viewCount || 0) > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8);

  const topVisitedShops = [...shops]
    .filter(s => (s.viewCount || 0) > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8);

  const totalProductViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalShopViews = shops.reduce((sum, s) => sum + (s.viewCount || 0), 0);

  return (
    <BazaarContext.Provider value={{
      cities: BAZAAR_DATA.cities,
      currentCity,
      setCurrentCity,
      categories,
      markets,
      banners,
      products,
      shops,
      savedProductIds,
      followedShopIds,
      currentUser,
      isProductSaved,
      toggleSaveProduct,
      clearSavedProducts,
      isShopFollowed,
      toggleFollowShop,
      createShop,
      updateShopDetails,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleShopVerification,
      deleteShop,
      addCategory,
      updateCategory,
      deleteCategory,
      addMarket,
      updateMarket,
      deleteMarket,
      addBanner,
      updateBanner,
      toggleBannerActive,
      deleteBanner,
      login,
      logout,
      generateWhatsAppLink,
      openWhatsApp,
      isDataLoading,
      setIsDataLoading,
      // Analytics
      topViewedProducts,
      topVisitedShops,
      totalProductViews,
      totalShopViews,
    }}>
      {children}
    </BazaarContext.Provider>
  );
};

const defaultBazaarContext = {
  isDataLoading: false,
  products: [],
  shops: [],
  categories: [],
  markets: [],
  banners: [],
  savedProductIds: [],
  followedShopIds: [],
  currentUser: null,
  isProductSaved: () => false,
  toggleSaveProduct: () => { },
  clearSavedProducts: () => { },
  isShopFollowed: () => false,
  toggleFollowShop: () => { },
  createShop: async () => ({}),
  updateShopDetails: async () => { },
  addProduct: async () => { },
  updateProduct: async () => { },
  deleteProduct: async () => { },
  toggleShopVerification: async () => { },
  deleteShop: async () => { },
  addCategory: async () => { },
  updateCategory: async () => { },
  deleteCategory: async () => { },
  addMarket: async () => { },
  updateMarket: async () => { },
  deleteMark: async () => { },
  addBanner: async () => { },
  updateBanner: async () => { },
  toggleBannerActive: async () => { },
  deleteBanner: async () => { },
  login: () => { },
  logout: () => { },
  generateWhatsAppLink: () => '',
  openWhatsApp: () => { },
  // Analytics defaults
  topViewedProducts: [],
  topVisitedShops: [],
  totalProductViews: 0,
  totalShopViews: 0,
};

export const useBazaar = () => {
  const ctx = useContext(BazaarContext);
  return ctx || defaultBazaarContext;
};
