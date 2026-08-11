/**
 * Centralized Search Utilities for Meena Bazaar
 * Comprehensive matching for products and shops against all database fields.
 */

export const matchProductSearch = (product, query) => {
  if (!query || !query.trim()) return true;
  if (!product || product.deleted) return false;

  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const targetText = [
    product.name,
    product.brand,
    product.category,
    product.categoryName,
    product.shopName,
    product.market,
    product.description
  ].filter(Boolean).join(' ').toLowerCase();

  return tokens.every(token => targetText.includes(token));
};

export const matchShopSearch = (shop, query) => {
  if (!query || !query.trim()) return true;
  if (!shop || shop.deleted) return false;

  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const targetText = [
    shop.name,
    shop.market,
    shop.address,
    shop.city,
    shop.category,
    shop.categoryName,
    shop.description
  ].filter(Boolean).join(' ').toLowerCase();

  return tokens.every(token => targetText.includes(token));
};
