import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { BAZAAR_DATA } from '../data';
import { db, isFirebaseConfigured } from '../firebase';
import { STORAGE_KEYS, FIRESTORE_COLLECTIONS, APP_CONFIG } from '../constants/appConstants';
import { DEFAULT_STORE_LOGO, DEFAULT_COVER_BANNER, DEFAULT_PRODUCT_IMAGE } from '../utils/defaultAssets';

const BazaarContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "fa-laptop", description: "Mobile phones, laptops, and gadgets" },
  { id: "fashion", name: "Fashion", icon: "fa-shirt", description: "Apparel, sarees, suits, and garments" },
  { id: "groceries", name: "Groceries", icon: "fa-basket-shopping", description: "Daily essentials, spices, and provisions" },
  { id: "footwear", name: "Footwear", icon: "fa-shoe-prints", description: "Shoes, sandals, and traditional footwear" },
  { id: "cosmetics", name: "Cosmetics", icon: "fa-spray-can-sparkles", description: "Beauty products, perfumes, and care" },
  { id: "furniture", name: "Furniture", icon: "fa-couch", description: "Home decor, tables, and wooden furniture" },
  { id: "mobile-acc", name: "Mobile Accessories", icon: "fa-mobile-screen-button", description: "Cases, chargers, and earphones" },
  { id: "jewellery", name: "Jewellery", icon: "fa-gem", description: "Gold, silver, and artificial jewellery" },
  { id: "books", name: "Books & Stationery", icon: "fa-book", description: "Educational books, notebooks, and supplies" }
];

const DEFAULT_MARKETS = [
  { id: "gandhi-market", name: "Gandhi Market", city: "Rampur", area: "Center City", description: "Major retail hub for clothing, electronics, and daily essentials" },
  { id: "nai-sadak", name: "Nai Sadak", city: "Rampur", area: "Old City", description: "Famous market for footwear, textiles, and traditional bazaar items" },
  { id: "civil-lines", name: "Civil Lines", city: "Rampur", area: "Civil Lines", description: "Premium commercial market area for boutiques and showrooms" },
  { id: "mandi-samiti", name: "Mandi Samiti", city: "Rampur", area: "Station Road", description: "Wholesale and retail hub for groceries and fresh produce" },
  { id: "bada-bazaar", name: "Bada Bazaar", city: "Rampur", area: "Central Rampur", description: "Historic market for jewellery, bridal wear, and handicrafts" }
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
  const [categories, setCategories] = useState(() => safeGetItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES));

  // Dynamic Markets / Locations State
  const [markets, setMarkets] = useState(() => safeGetItem(STORAGE_KEYS.MARKETS, DEFAULT_MARKETS));

  // Saved Products Wishlist State
  const [savedProductIds, setSavedProductIds] = useState(() => safeGetItem(STORAGE_KEYS.SAVED_PRODUCTS, []));

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => safeGetItem(STORAGE_KEYS.USER_PROFILE, { role: 'guest' }));

  // Active City
  const [currentCity, setCurrentCity] = useState(BAZAAR_DATA.currentCity || APP_CONFIG.DEFAULT_CITY);

  // ── REAL FIREBASE FIRESTORE SYNC (DYNAMIC REAL-TIME DATA) ──
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Sync Real Shops Collection
    const shopsUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.SHOPS), (snapshot) => {
      const loadedShops = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => !s.deleted);
      if (loadedShops.length > 0) {
        setShops(loadedShops);
      }
    }, (err) => console.warn("Firestore shops snapshot error:", err));

    // 2. Sync Real Products Collection
    const productsUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.PRODUCTS), (snapshot) => {
      const loadedProds = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => !p.deleted);
      if (loadedProds.length > 0) {
        setProducts(loadedProds);
      }
    }, (err) => console.warn("Firestore products snapshot error:", err));

    // 3. Sync Dynamic Categories Collection
    const categoriesUnsub = onSnapshot(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES), (snapshot) => {
      const loadedCats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(c => !c.deleted);
      if (loadedCats.length > 0) {
        setCategories(loadedCats);
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
      if (loadedMkts.length > 0) {
        setMarkets(loadedMkts);
      } else {
        // Seed default markets if collection is empty
        DEFAULT_MARKETS.forEach(mkt => {
          setDoc(doc(db, FIRESTORE_COLLECTIONS.MARKETS, mkt.id), mkt, { merge: true }).catch(err => console.warn("Error seeding market:", err));
        });
      }
    }, (err) => console.warn("Firestore markets snapshot error:", err));

    return () => {
      shopsUnsub();
      productsUnsub();
      categoriesUnsub();
      marketsUnsub();
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
    safeSetItem(STORAGE_KEYS.SAVED_PRODUCTS, savedProductIds);
  }, [savedProductIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.USER_PROFILE, currentUser);
  }, [currentUser]);

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
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prev => prev.filter(p => p.id !== productId));

    setShops(prevShops => prevShops.map(s => {
      if (s.id === product.shopId) {
        return { ...s, productsCount: Math.max(0, (s.productsCount || 1) - 1) };
      }
      return s;
    }));

    if (isFirebaseConfigured) {
      try {
        const productRef = doc(db, 'products', productId);
        await setDoc(productRef, { deleted: true }, { merge: true });
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
        const shopRef = doc(db, 'shops', shopId);
        await setDoc(shopRef, { verified: newStatus }, { merge: true });
      } catch (err) {
        console.warn("Could not update verification status in Firestore:", err);
      }
    }
  };

  const deleteShop = async (shopId) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
    setProducts(prev => prev.filter(p => p.shopId !== shopId));

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, 'shops', shopId);
        await setDoc(shopRef, { deleted: true }, { merge: true });
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
    const shopPhone = shop ? (shop.whatsapp || shop.phone) : "";
    const cleanPhone = (shopPhone || "").replace(/[^0-9]/g, '');
    const text = `Hello,\n\nI found your product on Meena Bazaar.\n\nProduct:\n${product.name}\n\nPrice:\n₹${product.price?.toLocaleString('en-IN')}\n\nIs it available?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const openWhatsApp = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const shop = shops.find(s => s.id === product.shopId);
    const link = generateWhatsAppLink(product, shop);
    window.open(link, "_blank");
  };

  return (
    <BazaarContext.Provider value={{
      cities: BAZAAR_DATA.cities,
      currentCity,
      setCurrentCity,
      categories,
      markets,
      products,
      shops,
      savedProductIds,
      currentUser,
      isProductSaved,
      toggleSaveProduct,
      clearSavedProducts,
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
      login,
      logout,
      generateWhatsAppLink,
      openWhatsApp
    }}>
      {children}
    </BazaarContext.Provider>
  );
};

export const useBazaar = () => useContext(BazaarContext);
