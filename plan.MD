# Implementation Plan - Digital Meena Bazaar PWA

Build a fast, mobile-friendly Progressive Web Application (PWA) for **Digital Meena Bazaar** using pure HTML5, CSS3, and JavaScript, strictly adhering to the 5 provided desktop and mobile design screenshots and the project specification.

## User Review Required

> [!IMPORTANT]
> - The initial build will focus on the **5 core screens** shown in the provided images:
>   1. **Home Page** (`index.html`) - Hero banner, categories, featured products, new arrivals, popular shops horizontal slider.
>   2. **Shop Listing Page** (`shops.html`) - Rampur shop directory, filter by market/area/category, search, pagination.
>   3. **Shop Details Page** (`shop-details.html`) - Banner, store info, verified badge, tabs (Overview, Products, About, Reviews), store search, product grid.
>   4. **Product Details Page** (`product-details.html`) - Gallery slider/thumbnails, highlights, specs, pricing, "Order on WhatsApp" CTA, store card, related products.
>   5. **Saved Products Page** (`saved.html`) - LocalStorage persistent saved items, search, sort, quick WhatsApp order CTA.
> - **PWA Support**: Full PWA capabilities (`manifest.json`, Service Worker `sw.js` for offline caching, install prompt support).

---

## Technical Stack & Architecture

- **Frontend**: HTML5, Vanilla CSS3 (Custom properties, Flexbox, Grid), Vanilla JavaScript (ES6 Modules/Scripts).
- **Storage**: Browser `localStorage` for Saved Products list and user state.
- **PWA Features**: Service Worker (`sw.js`) and Web Application Manifest (`manifest.json`).
- **Icons**: Inline SVG / FontAwesome icons for crisp rendering.
- **Color Palette**:
  - Primary Green: `#006837` / `#056839`
  - Dark Header Bar: `#034a26`
  - Accent / Discount Red-Orange: `#d97706` / `#dc2626`
  - Background Light: `#f8fafc` / `#f1f5f9`
  - Card & Container Border: `#e2e8f0`

---

## Proposed File Structure

```
meena bazaar/
├── index.html              # Home Page
├── shops.html              # All Shops Listing Page
├── shop-details.html       # Individual Shop Details Page
├── product-details.html    # Individual Product Details Page
├── saved.html              # Saved Products Page
├── manifest.json           # PWA Web App Manifest
├── sw.js                   # PWA Service Worker
├── css/
│   └── style.css           # Complete responsive stylesheet (Desktop & Mobile)
├── js/
│   ├── data.js             # Mock Database (Products, Shops, Categories, Locations)
│   ├── app.js              # General UI, Navigation, Search, Saved Items & PWA installer
│   ├── product.js          # Product page logic (Gallery, specs, WhatsApp builder)
│   └── shop.js             # Shop listing & shop details filtering logic
└── assets/
    └── icons/              # App icons for PWA & favicon
```

---

## Detailed Page Implementations

### 1. Unified Layout & Navigation System
- **Desktop Navbar**:
  - Top utilities: Brand Logo with bag icon, Location Selector ("Rampur v"), Search bar with category dropdown, Quick actions (Saved with counter badge, Shops, Login button).
  - Primary Green Category Bar: `Categories ☰`, `Home`, `Shops`, `Saved`, `About Us`, `Contact Us`.
- **Mobile Navigation**:
  - Top Bar: Hamburger menu, Brand Logo, Location selector, Saved counter icon.
  - Sticky Bottom Navigation: `Home`, `Categories`, `Shops`, `Saved`, `Profile`.

### 2. Home Page (`index.html`)
- Hero Banner ("Find Everything from Local Shops in Rampur" + "SHOP LOCAL" graphic badge).
- Circular / rounded Top Categories slider (`Electronics`, `Fashion`, `Groceries`, `Footwear`, `Cosmetics`, `Furniture`, `Mobile Accessories`, `Jewellery`, `Books`, `More`).
- Featured Products Grid with discount tags (`10% OFF`, `New`), price, store name, quick WhatsApp & heart save buttons.
- New Arrivals section.
- Popular Shops horizontal scrollable container.

### 3. Shop Listing Page (`shops.html`)
- Header banner illustration "All Shops in Rampur - Discover local shops and find everything you need".
- Search input, dropdown filters for `All Categories`, `All Areas`, `All Markets`, `Sort By`.
- Grid of Shop Cards: Banner background, Logo circle overlay, Shop Name, Location ("Gandhi Market, Rampur"), Category, Products count badge (`120+ Products`), Rating, "Visit Shop ->" button.
- Pagination component (`1`, `2`, `3` ... `8`, `Next >`).

### 4. Shop Details Page (`shop-details.html`)
- Cover banner photo of shop storefront + circular shop avatar logo.
- Shop Name, Verified green check badge, Rating (`4.6 (125 Reviews)`), Address, Phone/WhatsApp number, Business hours badge ("Open Today").
- Quick Action buttons: "Order on WhatsApp", "Share Shop".
- Tabbed Navigation: `Overview`, `Products`, `About`, `Reviews`.
- In-shop Search Bar + Category Pills (`All Products`, `Mobiles`, `Accessories`, `Chargers`, `Earphones`, `Smart Watches`).
- Products Grid with WhatsApp ordering button.
- "You May Also Like" horizontal shops recommendations.

### 5. Product Details Page (`product-details.html`)
- Breadcrumbs (`Home > Shops > Sharma Mobile Store > Samsung Galaxy M16 5G`).
- Product Gallery: Main photo with discount badge ("10% OFF") + New Arrival badge, Left/Right slider controls, clickable thumbnail row.
- Details Section: Title, Brand, Rating/Reviews, Sold count, Price (`₹14,999` with strikethrough original `₹16,999`), Available at Shop box with address & rating link.
- Key Product Highlights list with checkmark icons.
- Prominent Call To Actions: Full-width green "Order on WhatsApp" button with WhatsApp icon + "Save Product" heart button.
- Redirect Notice: "You will be redirected to WhatsApp to chat with the shop".
- Detailed Tabs: `Description`, `Specifications`, `Reviews`, `Shop Info`, `Shipping & Returns`.
- Related Products Carousel / Grid.

### 6. Saved Products Page (`saved.html`)
- Counter header: `Saved Products (8)` + `Clear All` button.
- Search within saved items + Sort dropdown.
- Saved Products Grid (Desktop) and List view (Mobile) showing saved status ("Saved 2 days ago"), quick WhatsApp button, remove icon `✕`.
- Empty state display when no products are saved.

### 7. WhatsApp Integration Engine
- Formats pre-filled message:
  ```
  Hello,
  I found your product on Digital Meena Bazaar.

  Product: Samsung Galaxy M16 5G
  Price: ₹14,999
  Shop: Sharma Mobile Store

  Is it available?
  ```
- Opens `https://wa.me/<shop_phone>?text=<encoded_text>` in new window.

### 8. PWA Integration
- `manifest.json` with app icons, colors, display standalone.
- `sw.js` service worker caching app shell and static assets for fast offline capability.

---

## Verification Plan

### Automated / Browser Verification
- Open `index.html`, `shops.html`, `shop-details.html`, `product-details.html`, and `saved.html` in browser.
- Verify responsive breakpoints for Desktop (> 992px) and Mobile (< 768px).
- Test local storage saving/unsaving items: item counts update in header and saved items view.
- Test search filtering on Home, Shop Listing, and Shop Details pages.
- Verify WhatsApp link generation with encoded parameters.
- Verify Service Worker registration and PWA manifest validity.
