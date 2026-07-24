/* ==========================================================================
   Digital Meena Bazaar - Product Details View Logic (`product-details.html`)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("product-details-view")) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "samsung-m16-5g";
  const product = BAZAAR_DATA.products.find(p => p.id === productId) || BAZAAR_DATA.products[0];
  const shop = BAZAAR_DATA.shops.find(s => s.id === product.shopId) || BAZAAR_DATA.shops[0];

  renderProductDetails(product, shop);
  renderRelatedProducts(product);
});

function renderProductDetails(product, shop) {
  // Breadcrumb
  document.getElementById("breadcrumb-shop").textContent = shop.name;
  document.getElementById("breadcrumb-shop").href = `shop-details.html?id=${shop.id}`;
  document.getElementById("breadcrumb-product").textContent = product.name;

  // Gallery Main Image & Badges
  const galleryMain = document.getElementById("gallery-main-img");
  if (galleryMain) {
    galleryMain.src = product.images[0];
    galleryMain.alt = product.name;
  }

  const badgeDiscount = document.getElementById("badge-discount");
  if (badgeDiscount) badgeDiscount.textContent = product.discount;

  const badgeNew = document.getElementById("badge-new");
  if (badgeNew) badgeNew.textContent = product.badge || "New Arrival";

  // Gallery Thumbnails
  const thumbsWrap = document.getElementById("gallery-thumbs");
  if (thumbsWrap && product.images) {
    thumbsWrap.innerHTML = product.images.map((img, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
        <img src="${img}" alt="Thumb ${idx + 1}" />
      </div>
    `).join("");
  }

  // Basic Info
  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-brand").textContent = product.brand;
  document.getElementById("product-rating").textContent = product.rating;
  document.getElementById("product-reviews-count").textContent = product.reviewsCount;
  document.getElementById("product-sold-count").textContent = product.soldCount || 100;

  // Pricing
  document.getElementById("product-price").textContent = `₹${product.price.toLocaleString('en-IN')}`;
  document.getElementById("product-original-price").textContent = `₹${product.originalPrice.toLocaleString('en-IN')}`;
  document.getElementById("product-discount-text").textContent = product.discount;

  // Available Store Card
  document.getElementById("shop-available-name").textContent = shop.name;
  document.getElementById("shop-available-name").href = `shop-details.html?id=${shop.id}`;
  document.getElementById("shop-available-address").textContent = shop.address;
  document.getElementById("shop-available-rating").textContent = shop.rating;
  document.getElementById("shop-available-reviews").textContent = shop.reviewsCount;

  // Product Highlights List
  const highlightsList = document.getElementById("product-highlights");
  if (highlightsList && product.highlights) {
    highlightsList.innerHTML = product.highlights.map(h => `
      <li><i class="fa-solid fa-circle-check"></i> <span>${h}</span></li>
    `).join("");
  }

  // Description & Specifications
  document.getElementById("tab-description-text").textContent = product.description;

  const specsTable = document.getElementById("tab-specifications-table");
  if (specsTable && product.specifications) {
    specsTable.innerHTML = Object.entries(product.specifications).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `).join("");
  }

  // Action Buttons
  const waBtn = document.getElementById("btn-wa-order");
  const waBtnMob = document.getElementById("btn-wa-order-mob");
  if (waBtn) waBtn.onclick = () => MeenaBazaarApp.openWhatsApp(product.id);
  if (waBtnMob) waBtnMob.onclick = () => MeenaBazaarApp.openWhatsApp(product.id);

  const saveBtn = document.getElementById("btn-save-product");
  const saveBtnMob = document.getElementById("btn-save-product-mob");

  if (saveBtn) {
    updateSaveButtonState(saveBtn, product.id);
    saveBtn.onclick = () => {
      MeenaBazaarApp.toggleSaveProduct(product.id);
      updateSaveButtonState(saveBtn, product.id);
      if (saveBtnMob) updateSaveButtonStateMob(saveBtnMob, product.id);
    };
  }

  if (saveBtnMob) {
    updateSaveButtonStateMob(saveBtnMob, product.id);
    saveBtnMob.onclick = () => {
      MeenaBazaarApp.toggleSaveProduct(product.id);
      updateSaveButtonStateMob(saveBtnMob, product.id);
      if (saveBtn) updateSaveButtonState(saveBtn, product.id);
    };
  }
}

function updateSaveButtonStateMob(btn, productId) {
  const isSaved = MeenaBazaarApp.isProductSaved(productId);
  if (isSaved) {
    btn.innerHTML = `<i class="fa-solid fa-heart" style="color: #ef4444;"></i> Saved`;
    btn.classList.add("active");
  } else {
    btn.innerHTML = `<i class="fa-regular fa-heart"></i> Save`;
    btn.classList.remove("active");
  }
}

function changeMainImage(src, thumbElement) {
  document.getElementById("gallery-main-img").src = src;
  document.querySelectorAll(".thumb-item").forEach(el => el.classList.remove("active"));
  thumbElement.classList.add("active");
}

function updateSaveButtonState(btn, productId) {
  const isSaved = MeenaBazaarApp.isProductSaved(productId);
  if (isSaved) {
    btn.innerHTML = `<i class="fa-solid fa-heart" style="color: #ef4444;"></i> Saved`;
    btn.classList.add("active");
  } else {
    btn.innerHTML = `<i class="fa-regular fa-heart"></i> Save Product`;
    btn.classList.remove("active");
  }
}

function renderRelatedProducts(currentProduct) {
  const grid = document.getElementById("related-products-grid");
  if (!grid) return;

  const related = BAZAAR_DATA.products
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 5);

  grid.innerHTML = related.map(p => `
    <div class="product-card">
      <div class="product-card-badges">
        <span class="badge badge-new">${p.badge || 'New'}</span>
      </div>
      <a href="product-details.html?id=${p.id}" class="product-image-wrap">
        <img src="${p.images[0]}" alt="${p.name}">
      </a>
      <div class="product-details-content">
        <a href="product-details.html?id=${p.id}" class="product-title">${p.name}</a>
        <div class="product-price-row">
          <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="product-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>
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

function toggleCardSave(productId, btn) {
  const isSaved = MeenaBazaarApp.toggleSaveProduct(productId);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }
}
