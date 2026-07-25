import { createContext, useContext, useEffect, useState } from 'react';
import { BAZAAR_DATA } from '../data';

const BazaarContext = createContext();

// Seed initial orders if not present in localStorage
const INITIAL_ORDERS = [
  { id: "ORD-9821", date: "2026-07-24", productName: "Samsung Galaxy M16 5G", price: 14999, customerName: "Rahul Sharma", customerPhone: "+919988776655", status: "Pending", shopId: "sharma-mobile", shopName: "Sharma Mobile Store" },
  { id: "ORD-9820", date: "2026-07-23", productName: "boAt Wave Call Smartwatch", price: 1299, customerName: "Amit Kumar", customerPhone: "+918877665544", status: "Completed", shopId: "sharma-mobile", shopName: "Sharma Mobile Store" },
  { id: "ORD-9819", date: "2026-07-23", productName: "Nike Air Max Running Shoes", price: 4499, customerName: "Siddharth Singh", customerPhone: "+917766554433", status: "Pending", shopId: "khan-footwear", shopName: "Khan Footwear" },
  { id: "ORD-9818", date: "2026-07-22", productName: "Wild Stone Perfume", price: 599, customerName: "Pooja Gupta", customerPhone: "+916655443322", status: "Cancelled", shopId: "beauty-point", shopName: "Beauty Point" },
  { id: "ORD-9817", date: "2026-07-22", productName: "Wooden Office Chair", price: 3399, customerName: "Vikram Malhotra", customerPhone: "+915544332211", status: "Completed", shopId: "gupta-general", shopName: "Gupta General Store" }
];

export const BazaarProvider = ({ children }) => {
  // Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_products');
    return saved ? JSON.parse(saved) : BAZAAR_DATA.products;
  });

  // Shops State
  const [shops, setShops] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_shops');
    return saved ? JSON.parse(saved) : BAZAAR_DATA.shops;
  });

  // Saved Products State
  const [savedProductIds, setSavedProductIds] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_saved_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('meena_bazaar_user');
    return saved ? JSON.parse(saved) : { role: 'guest' };
  });

  // Active City
  const [currentCity, setCurrentCity] = useState(BAZAAR_DATA.currentCity);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('meena_bazaar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_saved_products', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('meena_bazaar_user', JSON.stringify(currentUser));
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

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      isNew: true,
      isFeatured: false,
      rating: 4.5,
      reviewsCount: 1,
      soldCount: 0,
      images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
      highlights: productData.highlights || [],
      specifications: productData.specifications || {}
    };

    setProducts(prev => [newProduct, ...prev]);

    // Update product count in shop
    setShops(prevShops => prevShops.map(s => {
      if (s.id === productData.shopId) {
        return { ...s, productsCount: (s.productsCount || 0) + 1 };
      }
      return s;
    }));
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prev => prev.filter(p => p.id !== productId));

    // Decrement product count in shop
    setShops(prevShops => prevShops.map(s => {
      if (s.id === product.shopId) {
        return { ...s, productsCount: Math.max(0, (s.productsCount || 1) - 1) };
      }
      return s;
    }));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const toggleShopVerification = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, verified: !s.verified } : s));
  };

  const login = (email, password) => {
    if (email === 'admin@meenabazaar.com' && password === 'admin123') {
      setCurrentUser({ role: 'admin', email });
      return { success: true, redirect: '/dashboard/admin' };
    }

    // Find matching shop owner
    // For demo, any shop owner login is mapped to Sharma Mobile Store
    if (email.endsWith('@meenabazaar.com') && password === 'shop123') {
      const parts = email.split('@');
      const prefix = parts[0]; // e.g. sharma
      let matchedShop = shops.find(s => s.id.startsWith(prefix)) || shops[0];

      setCurrentUser({
        role: 'shop_owner',
        email,
        shopId: matchedShop.id,
        shopName: matchedShop.name
      });
      return { success: true, redirect: '/dashboard/shop' };
    }

    if (email === 'sharma@meenabazaar.com' && password === 'sharma123') {
      setCurrentUser({
        role: 'shop_owner',
        email,
        shopId: 'sharma-mobile',
        shopName: 'Sharma Mobile Store'
      });
      return { success: true, redirect: '/dashboard/shop' };
    }

    return { success: false, message: 'Invalid credentials. Use admin@meenabazaar.com / admin123 or sharma@meenabazaar.com / sharma123' };
  };

  const logout = () => {
    setCurrentUser({ role: 'guest' });
  };

  const generateWhatsAppLink = (product, shop) => {
    const shopPhone = shop ? shop.whatsapp : "919876543210";
    const text = `Hello,\n\nI found your product on Meena Bazaar.\n\nProduct:\n${product.name}\n\nPrice:\n₹${product.price.toLocaleString('en-IN')}\n\nIs it available?`;
    return `https://wa.me/${shopPhone}?text=${encodeURIComponent(text)}`;
  };

  const openWhatsApp = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const shop = shops.find(s => s.id === product.shopId);

    // Record as order lead in state
    addOrder({
      productName: product.name,
      price: product.price,
      customerName: "WhatsApp Lead",
      customerPhone: shop?.phone || "+919876543210",
      shopId: product.shopId,
      shopName: product.shopName
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
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addOrder,
      toggleShopVerification,
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
