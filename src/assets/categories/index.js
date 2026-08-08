import allAsset from './all.svg';
import fashionAsset from './fashion.svg';
import electronicsAsset from './electronics.svg';
import mobileAsset from './mobile-acc.svg';
import groceriesAsset from './groceries.svg';
import footwearAsset from './footwear.svg';
import cosmeticsAsset from './cosmetics.svg';
import furnitureAsset from './furniture.svg';
import jewelleryAsset from './jewellery.svg';
import booksAsset from './books.svg';
import toysAsset from './toys.svg';
import sportsAsset from './sports.svg';
import sweetsAsset from './sweets.svg';
import healthAsset from './health.svg';
import automotiveAsset from './automotive.svg';

export const CATEGORY_ASSETS = {
  all: allAsset,
  fashion: fashionAsset,
  electronics: electronicsAsset,
  'mobile-acc': mobileAsset,
  groceries: groceriesAsset,
  footwear: footwearAsset,
  cosmetics: cosmeticsAsset,
  furniture: furnitureAsset,
  jewellery: jewelleryAsset,
  books: booksAsset,
  toys: toysAsset,
  sports: sportsAsset,
  sweets: sweetsAsset,
  health: healthAsset,
  automotive: automotiveAsset,
};

export const getCategoryAsset = (categoryOrId) => {
  if (!categoryOrId) return allAsset;
  const idStr = typeof categoryOrId === 'string' ? categoryOrId.toLowerCase() : (categoryOrId.id || categoryOrId.name || '').toLowerCase();
  
  if (CATEGORY_ASSETS[idStr]) return CATEGORY_ASSETS[idStr];

  // Match by keyword in name/id
  if (idStr.includes('fashion') || idStr.includes('cloth') || idStr.includes('apparel')) return fashionAsset;
  if (idStr.includes('electronic') || idStr.includes('gadget') || idStr.includes('laptop')) return electronicsAsset;
  if (idStr.includes('mobile') || idStr.includes('phone') || idStr.includes('acc')) return mobileAsset;
  if (idStr.includes('grocer') || idStr.includes('food') || idStr.includes('spice')) return groceriesAsset;
  if (idStr.includes('footwear') || idStr.includes('shoe') || idStr.includes('sandal')) return footwearAsset;
  if (idStr.includes('cosmetic') || idStr.includes('beauty') || idStr.includes('makeup')) return cosmeticsAsset;
  if (idStr.includes('furniture') || idStr.includes('home') || idStr.includes('decor')) return furnitureAsset;
  if (idStr.includes('jewel') || idStr.includes('gold') || idStr.includes('watch')) return jewelleryAsset;
  if (idStr.includes('book') || idStr.includes('stationer')) return booksAsset;
  if (idStr.includes('toy') || idStr.includes('baby') || idStr.includes('game')) return toysAsset;
  if (idStr.includes('sport') || idStr.includes('fitness') || idStr.includes('gym')) return sportsAsset;
  if (idStr.includes('sweet') || idStr.includes('bakery') || idStr.includes('mithai')) return sweetsAsset;
  if (idStr.includes('health') || idStr.includes('pharma') || idStr.includes('wellness')) return healthAsset;
  if (idStr.includes('auto') || idStr.includes('hardware') || idStr.includes('car') || idStr.includes('bike')) return automotiveAsset;

  return allAsset;
};
