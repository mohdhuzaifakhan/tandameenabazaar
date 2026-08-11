// Digital Meena Bazaar - Central Application Constants

export const APP_CONFIG = {
  NAME: 'Meena Bazaar',
  BRAND_TITLE: 'Meena Bazaar',
  SLOGAN: 'Discover Local Shops & Products',
  DEFAULT_CITY: 'Rampur',
  CITIES: ['Rampur', 'Moradabad', 'Bareilly', 'Sambhal', 'Amroha', 'Bijnor', 'Shahjahanpur', 'Delhi NCR'],
  SUPPORT_EMAIL: 'mohdhuzaifa8126195456@gmail.com',
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || '',
};

export const STORAGE_KEYS = {
  PRODUCTS: 'meena_bazaar_products_v3',
  SHOPS: 'meena_bazaar_shops_v3',
  CATEGORIES: 'meena_bazaar_categories_v3',
  MARKETS: 'meena_bazaar_markets_v3',
  SAVED_PRODUCTS: 'meena_bazaar_saved_products_v3',
  USER_PROFILE: 'meena_bazaar_user_v3',
  AUTH_USER: 'meena_bazaar_auth_user_v3',
  CITY: 'meena_bazaar_city_v3',
  BANNERS: 'meena_bazaar_banners_v3',
  FOLLOWED_SHOPS: 'meena_bazaar_followed_shops_v3',
  ANALYTICS_VIEWS: 'meena_bazaar_analytics_v1',
};

export const FIRESTORE_COLLECTIONS = {
  SHOPS: 'shops',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  MARKETS: 'markets',
  USERS: 'users',
  BANNERS: 'banners',
  ANALYTICS: 'analytics',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'shop_owner',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

export const DEFAULT_CATEGORY_ICONS = [
  'fa-shapes',
  'fa-laptop',
  'fa-shirt',
  'fa-basket-shopping',
  'fa-shoe-prints',
  'fa-spray-can-sparkles',
  'fa-couch',
  'fa-mobile-screen-button',
  'fa-gem',
  'fa-book',
  'fa-store',
  'fa-plug',
  'fa-car',
  'fa-heart',
  'fa-bicycle',
  'fa-camera',
  'fa-kitchen-set',
  'fa-tag',
];

export const UI_LABELS = {
  LIVE_STOREFRONT: 'View Live Shops',
  VERIFIED_BADGE: 'Verified Shops',
  UNVERIFIED_BADGE: 'Verification Pending',
  OUT_OF_STOCK: 'Out of Stock',
  IN_STOCK: 'In Stock',
  WHATSAPP_CONNECT: 'WhatsApp Connect',
};


export const DEFAULT_CATEGORIES = [
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