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

  // Mobile Navigation Bottom Bar & Drawer Manager
  initMobileNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    // 1. Highlight bottom nav items
    const navItems = document.querySelectorAll(".bottom-nav-item, .mobile-bottom-nav .mobile-nav-item");
    navItems.forEach(item => {
      const href = item.getAttribute("href");
      if (href && href.includes(currentPath)) {
        item.classList.add("active");
      }
    });

    // 2. Inject Drawer Markup Dynamically
    if (!document.getElementById("mobile-drawer")) {
      const overlay = document.createElement("div");
      overlay.className = "mobile-drawer-overlay";
      overlay.id = "mobile-drawer-overlay";
      
      const drawer = document.createElement("div");
      drawer.className = "mobile-drawer";
      drawer.id = "mobile-drawer";
      drawer.innerHTML = `
        <div class="mobile-drawer-header">
          <a href="index.html" class="logo" style="display: flex; align-items: center; gap: 8px;">
            <div class="logo-icon" style="width: 32px; height: 32px; font-size: 0.9rem; background: var(--primary-green); color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-bag-shopping"></i></div>
            <div class="logo-text" style="display: flex; flex-direction: column; line-height: 1.1;">
              <span style="font-size: 0.65rem; font-weight: 600; color: var(--text-muted);">Digital</span>
              <span style="font-size: 0.95rem; font-weight: 800; color: var(--primary-green);">Meena Bazaar</span>
            </div>
          </a>
          <button class="mobile-drawer-close" id="mobile-drawer-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mobile-drawer-body">
          <nav class="mobile-drawer-nav">
            <a href="index.html" class="mobile-drawer-link ${currentPath === 'index.html' ? 'active' : ''}"><i class="fa-solid fa-house"></i><span>Home</span></a>
            <a href="shops.html" class="mobile-drawer-link ${currentPath === 'shops.html' ? 'active' : ''}"><i class="fa-solid fa-store"></i><span>Shops</span></a>
            <a href="saved.html" class="mobile-drawer-link ${currentPath === 'saved.html' ? 'active' : ''}"><i class="fa-solid fa-heart"></i><span>Saved Products</span></a>
            <a href="about.html" class="mobile-drawer-link ${currentPath === 'about.html' ? 'active' : ''}"><i class="fa-solid fa-circle-info"></i><span>About Us</span></a>
            <a href="contact.html" class="mobile-drawer-link ${currentPath === 'contact.html' ? 'active' : ''}"><i class="fa-solid fa-phone"></i><span>Contact Us</span></a>
          </nav>
          <div class="mobile-drawer-divider"></div>
          <div class="mobile-drawer-nav">
            <a href="login.html" class="mobile-drawer-link"><i class="fa-regular fa-user"></i><span>Shop Owner Portal</span></a>
            <a href="login.html" class="mobile-drawer-link"><i class="fa-solid fa-user-shield"></i><span>Admin Dashboard</span></a>
          </div>
        </div>
        <div class="mobile-drawer-footer">
          <p style="font-size: 0.72rem; color: var(--text-muted); text-align: center; line-height: 1.4;">
            &copy; 2026 Digital Meena Bazaar<br>
            Powered by <strong>UnifiedStack</strong>
          </p>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      // 3. Bind Hamburger Events
      const openDrawer = () => {
        overlay.classList.add("active");
        drawer.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
      };

      const closeDrawer = () => {
        overlay.classList.remove("active");
        drawer.classList.remove("active");
        document.body.style.overflow = "";
      };

      // Query all possible hamburger triggers on mobile header
      const hamburgers = document.querySelectorAll(".mobile-header-bar .fa-bars, .mobile-header .fa-bars, .mobile-header-top .fa-bars");
      hamburgers.forEach(h => {
        h.addEventListener("click", openDrawer);
      });

      // Bind close events
      document.getElementById("mobile-drawer-close-btn")?.addEventListener("click", closeDrawer);
      overlay.addEventListener("click", closeDrawer);

      // Bind Categories button in bottom nav to open the drawer
      const mobileCategoriesBtn = Array.from(document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item")).find(item => item.textContent.includes("Categories"));
      if (mobileCategoriesBtn) {
        mobileCategoriesBtn.addEventListener("click", (e) => {
          e.preventDefault();
          openDrawer();
        });
      }
    }

    // Set Profile link to login.html if it's currently '#'
    const profileBtn = Array.from(document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item")).find(item => item.textContent.includes("Profile"));
    if (profileBtn && profileBtn.getAttribute("href") === "#") {
      profileBtn.setAttribute("href", "login.html");
    }
  },

  // Global Search Redirect
  initSearchInputs() {
    const performSearch = (input) => {
      if (input && input.value.trim()) {
        window.location.href = `shops.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    };

    const searchBtns = document.querySelectorAll(".header-search button, .mobile-header-search button, .shops-filter-search button");
    searchBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const input = btn.previousElementSibling;
        performSearch(input);
      });
    });

    const searchInputs = document.querySelectorAll(".header-search input, .mobile-header-search input, .shops-filter-search input");
    searchInputs.forEach(input => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          performSearch(input);
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MeenaBazaarApp.init();
});
