// Digital Meena Bazaar - Central Application Constants

export const APP_CONFIG = {
  NAME: 'Meena Bazaar',
  BRAND_TITLE: 'Meena Bazaar',
  SLOGAN: 'Discover Local Shops & Products',
  DEFAULT_CITY: 'Rampur',
  CITIES: ['Rampur', 'Moradabad', 'Bareilly'],
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
};

export const FIRESTORE_COLLECTIONS = {
  SHOPS: 'shops',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  MARKETS: 'markets',
  USERS: 'users',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'shop_owner',
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
