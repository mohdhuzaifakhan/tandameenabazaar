/* ==========================================================================
   Digital Meena Bazaar - Shop & Shop Details View Logic (`shops.html` & `shop-details.html`)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Check which page we are on
  if (document.getElementById("shops-listing-view")) {
    initShopsListing();
  } else if (document.getElementById("shop-details-view")) {
    initShopDetails();
  }
});

/* ==========================================================================
   SHOPS LISTING (`shops.html`)
   ========================================================================== */
function initShopsListing() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("search") || "";

  const searchInput = document.getElementById("shop-search-input");
  if (searchInput && initialSearch) {
    searchInput.value = initialSearch;
  }

  // Populate Dropdown Filters
  populateMarketOptions();
  
  // Event listeners for live filtering
  if (searchInput) searchInput.addEventListener("input", filterAndRenderShops);
  
  const categoryFilter = document.getElementById("filter-category");
  if (categoryFilter) categoryFilter.addEventListener("change", filterAndRenderShops);

  const marketFilter = document.getElementById("filter-market");
  if (marketFilter) marketFilter.addEventListener("change", filterAndRenderShops);

  filterAndRenderShops();
}

function populateMarketOptions() {
  const marketSelect = document.getElementById("filter-market");
  if (!marketSelect) return;
  
  marketSelect.innerHTML = `<option value="">All Areas / Markets</option>` +
    BAZAAR_DATA.markets.map(m => `<option value="${m}">${m}</option>`).join("");
}

function filterAndRenderShops() {
  const grid = document.getElementById("shops-grid-container");
  if (!grid) return;

  const searchQuery = (document.getElementById("shop-search-input")?.value || "").toLowerCase().trim();
  const selectedCat = document.getElementById("filter-category")?.value || "";
  const selectedMarket = document.getElementById("filter-market")?.value || "";

  let filtered = BAZAAR_DATA.shops.filter(shop => {
    const matchesSearch = !searchQuery || 
      shop.name.toLowerCase().includes(searchQuery) ||
      shop.market.toLowerCase().includes(searchQuery) ||
      shop.address.toLowerCase().includes(searchQuery);

    const matchesCat = !selectedCat || shop.category === selectedCat;
    const matchesMarket = !selectedMarket || shop.market === selectedMarket;

    return matchesSearch && matchesCat && matchesMarket;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <i class="fa-solid fa-store-slash" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px;"></i>
        <h3>No Shops Found</h3>
        <p style="color: #64748b;">Try adjusting your search query or filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(shop => `
    <div class="shop-card">
      <img src="${shop.bannerImage}" alt="${shop.name}" class="shop-card-banner">
      <span class="shop-products-badge">${shop.productsCount}+ Products</span>
      <div class="shop-card-body">
        <img src="${shop.logoImage}" alt="${shop.name}" class="shop-card-avatar">
        <h3 class="shop-card-name">${shop.name} ${shop.verified ? '<i class="fa-solid fa-circle-check badge-verified"></i>' : ''}</h3>
        <div class="shop-card-location"><i class="fa-solid fa-location-dot"></i> ${shop.address}</div>
        <div class="shop-card-category">${shop.categoryName}</div>
        <div class="shop-card-footer">
          <div class="shop-rating"><i class="fa-solid fa-star"></i> ${shop.rating} (${shop.reviewsCount})</div>
          <a href="shop-details.html?id=${shop.id}" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.85rem;">Visit Shop <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   SHOP DETAILS (`shop-details.html`)
   ========================================================================== */
let currentShop = null;

function initShopDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const shopId = urlParams.get("id") || "sharma-mobile";
  currentShop = BAZAAR_DATA.shops.find(s => s.id === shopId) || BAZAAR_DATA.shops[0];

  renderShopHeader(currentShop);
  renderShopOverview(currentShop);
  initShopTabs();
}

function renderShopHeader(shop) {
  document.getElementById("shop-cover-img").src = shop.bannerImage;
  document.getElementById("shop-logo-img").src = shop.logoImage;
  document.getElementById("shop-name").textContent = shop.name;
  document.getElementById("shop-rating").textContent = `${shop.rating} (${shop.reviewsCount} Reviews)`;
  document.getElementById("shop-address").textContent = shop.address;
  document.getElementById("shop-phone").textContent = shop.phone;
  document.getElementById("shop-phone").href = `tel:${shop.phone}`;
  document.getElementById("shop-hours").textContent = shop.hours;
  document.getElementById("shop-status").textContent = `(${shop.statusText})`;

  // Direct shop WhatsApp contact button
  const shopWaBtn = document.getElementById("btn-shop-wa");
  if (shopWaBtn) {
    shopWaBtn.onclick = () => {
      const text = `Hello ${shop.name},\n\nI found your store on Digital Meena Bazaar and would like to inquire about your products.`;
      window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
    };
  }
}

function renderShopOverview(shop) {
  document.getElementById("shop-desc-text").textContent = shop.description;

  // Render Shop Products Grid inside Shop Details
  const shopProducts = BAZAAR_DATA.products.filter(p => p.shopId === shop.id);
  const grid = document.getElementById("shop-products-grid");
  
  if (grid) {
    grid.innerHTML = shopProducts.map(p => `
      <div class="product-card">
        <div class="product-card-badges">
          <span class="badge ${p.badge.includes('%') ? 'badge-discount' : 'badge-new'}">${p.badge}</span>
        </div>
        <a href="product-details.html?id=${p.id}" class="product-image-wrap">
          <img src="${p.images[0]}" alt="${p.name}">
        </a>
        <div class="product-details-content">
          <a href="product-details.html?id=${p.id}" class="product-title">${p.name}</a>
          <div class="product-price-row">
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.originalPrice ? `<span class="product-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn btn-whatsapp" onclick="MeenaBazaarApp.openWhatsApp('${p.id}')">
              <i class="fa-brands fa-whatsapp"></i> Order
            </button>
            <button class="btn-icon ${MeenaBazaarApp.isProductSaved(p.id) ? 'active' : ''}" onclick="toggleCardSave('${p.id}', this)">
              <i class="fa-${MeenaBazaarApp.isProductSaved(p.id) ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }
}

function initShopTabs() {
  const tabs = document.querySelectorAll(".shop-tab-item");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetTab = tab.getAttribute("data-tab");
      document.querySelectorAll(".shop-tab-content").forEach(c => c.classList.remove("active"));
      const targetContent = document.getElementById(`tab-content-${targetTab}`);
      if (targetContent) targetContent.classList.add("active");
    });
  });
}
