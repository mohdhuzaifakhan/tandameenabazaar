import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { BAZAAR_DATA } from '../data';
import { db, isFirebaseConfigured } from '../firebase';

const BazaarContext = createContext();

export const BazaarProvider = ({ children }) => {
  // Real Products State (Defaults to empty array)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_products_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Real Shops State (Defaults to empty array)
  const [shops, setShops] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_shops_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Saved Products Wishlist State
  const [savedProductIds, setSavedProductIds] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_saved_products_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Real Customer Lead Orders State (Defaults to empty array)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_user_v2');
    return saved ? JSON.parse(saved) : { role: 'guest' };
  });

  // Active City
  const [currentCity, setCurrentCity] = useState(BAZAAR_DATA.currentCity);

  // ── REAL FIREBASE FIRESTORE SYNC (READ ONLY REAL DATA) ──
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Sync Real Shops Collection
    const shopsUnsub = onSnapshot(collection(db, 'shops'), (snapshot) => {
      const loadedShops = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => !s.deleted);
      setShops(loadedShops);
    }, (err) => console.warn("Firestore shops snapshot error:", err));

    // 2. Sync Real Products Collection
    const productsUnsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const loadedProds = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => !p.deleted);
      setProducts(loadedProds);
    }, (err) => console.warn("Firestore products snapshot error:", err));

    // 3. Sync Real Orders Collection
    const ordersUnsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const loadedOrders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(o => !o.deleted);
      setOrders(loadedOrders);
    }, (err) => console.warn("Firestore orders snapshot error:", err));

    return () => {
      shopsUnsub();
      productsUnsub();
      ordersUnsub();
    };
  }, []);

  // Sync real state to localStorage
  useEffect(() => {
    localStorage.setItem('meena_bazaar_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_shops_v2', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_saved_products_v2', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_user_v2', JSON.stringify(currentUser));
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
  const createShop = async (shopData, userUid = null) => {
    const shopId = shopData.id || (shopData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900));
    const newShop = {
      id: shopId,
      name: shopData.name,
      category: shopData.category || 'Electronics',
      market: shopData.market || 'Main Market',
      location: shopData.location || shopData.market || 'Main Market',
      phone: shopData.phone || '',
      whatsapp: shopData.whatsapp || shopData.phone?.replace(/[^0-9]/g, '') || '',
      rating: 5.0,
      reviewsCount: 0,
      productsCount: 0,
      verified: true,
      ownerUid: userUid,
      timing: shopData.timing || '10:00 AM - 9:00 PM',
      address: shopData.address || '',
      description: shopData.description || '',
      image: shopData.image || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80',
      banner: shopData.banner || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80'
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
            shopName: newShop.name
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
    setShops(prevShops =>
      prevShops.map(s => (s.id === shopId ? { ...s, ...updatedData } : s))
    );

    if (updatedData.name) {
      setProducts(prevProducts =>
        prevProducts.map(p => (p.shopId === shopId ? { ...p, shopName: updatedData.name } : p))
      );
    }

    if (isFirebaseConfigured) {
      try {
        const shopRef = doc(db, 'shops', shopId);
        await setDoc(shopRef, updatedData, { merge: true });
      } catch (err) {
        console.warn("Could not update shop details in Firestore:", err);
      }
    }
  };

  const addProduct = async (productData) => {
    const id = productData.id || (productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900));
    const newProduct = {
      ...productData,
      id,
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      isNew: true,
      isFeatured: false,
      rating: productData.rating || 4.5,
      reviewsCount: productData.reviewsCount || 1,
      soldCount: productData.soldCount || 0,
      images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
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
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));

    if (isFirebaseConfigured) {
      try {
        const productRef = doc(db, 'products', updatedProduct.id);
        await setDoc(productRef, updatedProduct, { merge: true });
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

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    if (isFirebaseConfigured) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, { status: newStatus }, { merge: true });
      } catch (err) {
        console.warn("Could not update order status in Firestore:", err);
      }
    }
  };

  const addOrder = async (orderData) => {
    const id = orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== id)]);

    if (isFirebaseConfigured) {
      try {
        const orderRef = doc(db, 'orders', id);
        await setDoc(orderRef, newOrder, { merge: true });
      } catch (err) {
        console.warn("Could not add order in Firestore:", err);
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

  const login = (email, password) => {
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'mohdhuzaifa8126195456@gmail.com').toLowerCase().trim();
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

    addOrder({
      productName: product.name,
      price: product.price,
      customerName: "WhatsApp Lead",
      customerPhone: shop?.phone || "",
      shopId: product.shopId,
      shopName: product.shopName || shop?.name || "Merchant Store"
    });

    const link = generateWhatsAppLink(product, shop);
    window.open(link, "_blank");
  };

  return (
    <BazaarContext.Provider value={{
      cities: BAZAAR_DATA.cities,
      currentCity,
      setCurrentCity,
      categories: BAZAAR_DATA.categories,
      markets: BAZAAR_DATA.markets,
      products,
      shops,
      savedProductIds,
      orders,
      currentUser,
      isProductSaved,
      toggleSaveProduct,
      clearSavedProducts,
      createShop,
      updateShopDetails,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addOrder,
      toggleShopVerification,
      deleteShop,
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
