/* ==========================================================================
   Digital Meena Bazaar - Global Application Logic
   LocalStorage Manager, WhatsApp Link Generator, UI Handlers & PWA
   ========================================================================== */

const MeenaBazaarApp = {
  // LocalStorage Key
  STORAGE_KEY: "meena_bazaar_saved_products",

  init() {
    this.updateSavedBadge();
    this.initPWA();
    this.initMobileNav();
    this.initSearchInputs();
  },

  // Saved Products State Management
  getSavedProductIds() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  isProductSaved(productId) {
    const saved = this.getSavedProductIds();
    return saved.includes(productId);
  },

  toggleSaveProduct(productId) {
    let saved = this.getSavedProductIds();
    if (saved.includes(productId)) {
      saved = saved.filter(id => id !== productId);
    } else {
      saved.push(productId);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));
    this.updateSavedBadge();
    return this.isProductSaved(productId);
  },

  clearSavedProducts() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateSavedBadge();
  },

  updateSavedBadge() {
    const savedCount = this.getSavedProductIds().length;
    const badges = document.querySelectorAll(".saved-counter-val");
    badges.forEach(badge => {
      badge.textContent = savedCount;
    });
  },

  // WhatsApp Message Generator
  generateWhatsAppLink(product, shop) {
    const shopPhone = shop ? shop.whatsapp : "919876543210";
    const text = `Hello,\n\nI found your product on Digital Meena Bazaar.\n\nProduct:\n${product.name}\n\nPrice:\n₹${product.price.toLocaleString('en-IN')}\n\nIs it available?`;
    return `https://wa.me/${shopPhone}?text=${encodeURIComponent(text)}`;
  },

  openWhatsApp(productId) {
    const product = BAZAAR_DATA.products.find(p => p.id === productId);
    if (!product) return;
    const shop = BAZAAR_DATA.shops.find(s => s.id === product.shopId);
    const link = this.generateWhatsAppLink(product, shop);
    window.open(link, "_blank");
  },

  // PWA Initialization
  initPWA() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
          .then(reg => console.log("Service Worker registered successfully"))
          .catch(err => console.log("Service worker registration failed:", err));
      });
    }
  },

  // Mobile Navigation Bottom Bar Active State
  initMobileNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll(".bottom-nav-item");
    navItems.forEach(item => {
      const href = item.getAttribute("href");
      if (href && href.includes(currentPath)) {
        item.classList.add("active");
      }
    });
  },

  // Global Search Redirect
  initSearchInputs() {
    const searchBtns = document.querySelectorAll(".header-search button, .shops-filter-search button");
    searchBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const input = btn.previousElementSibling;
        if (input && input.value.trim()) {
          window.location.href = `shops.html?search=${encodeURIComponent(input.value.trim())}`;
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MeenaBazaarApp.init();
});
