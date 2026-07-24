/* ==========================================================================
   Digital Meena Bazaar - Dashboard Interactive JavaScript
   Includes logic for Shop Dashboard, Admin Dashboard, Manage Orders,
   Manage Shops, and Shop Details.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLineCharts();
  initDonutChart();
  initPendingApprovals();
  initViewModeSwitcher();
  initSidebarToggle();
  initModals();

  initOrderFiltering();
  initShopFiltering();
});

// Sidebar Toggle Logic
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.dash-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Master View Mode Switcher (Desktop, Mobile Simulator, Side-by-Side)
function initViewModeSwitcher() {
  const btnDesktop = document.getElementById('view-btn-desktop');
  const btnMobile = document.getElementById('view-btn-mobile');
  const btnSideBySide = document.getElementById('view-btn-sidebyside');
  
  const containerFull = document.getElementById('view-container-full');
  const containerSideBySide = document.getElementById('view-container-sidebyside');
  const mobileSimulator = document.getElementById('mobile-simulator-wrapper');

  if (!btnDesktop || !containerFull) return;

  function setActiveView(mode) {
    [btnDesktop, btnMobile, btnSideBySide].forEach(btn => btn?.classList.remove('active'));
    
    if (mode === 'desktop') {
      btnDesktop.classList.add('active');
      containerFull.style.display = 'flex';
      containerFull.style.maxWidth = '100%';
      if (mobileSimulator) mobileSimulator.style.display = 'none';
      if (containerSideBySide) containerSideBySide.style.display = 'none';
    } else if (mode === 'mobile') {
      btnMobile?.classList.add('active');
      containerFull.style.display = 'none';
      if (containerSideBySide) containerSideBySide.style.display = 'none';
      if (mobileSimulator) mobileSimulator.style.display = 'block';
    } else if (mode === 'sidebyside') {
      btnSideBySide?.classList.add('active');
      containerFull.style.display = 'none';
      if (mobileSimulator) mobileSimulator.style.display = 'none';
      if (containerSideBySide) containerSideBySide.style.display = 'flex';
    }
  }

  btnDesktop?.addEventListener('click', () => setActiveView('desktop'));
  btnMobile?.addEventListener('click', () => setActiveView('mobile'));
  btnSideBySide?.addEventListener('click', () => setActiveView('sidebyside'));
}

// Order Filtering Logic (Manage Orders Page)
function initOrderFiltering() {
  const orderTabs = document.querySelectorAll('[data-order-tab]');
  const orderRows = document.querySelectorAll('#orders-tbody tr');
  const orderSearchInput = document.getElementById('order-search-input');
  const statusSelect = document.getElementById('filter-order-status');
  const selectAll = document.getElementById('select-all-orders');

  if (!orderRows.length) return;

  let activeTabStatus = 'all';

  function filterOrders() {
    const searchTerm = orderSearchInput ? orderSearchInput.value.toLowerCase().trim() : '';
    const selectedStatus = statusSelect ? statusSelect.value : 'all';

    orderRows.forEach(row => {
      const rowStatus = row.getAttribute('data-status') || '';
      const text = row.innerText.toLowerCase();

      const matchesTab = (activeTabStatus === 'all' || rowStatus === activeTabStatus);
      const matchesSelect = (selectedStatus === 'all' || rowStatus === selectedStatus);
      const matchesSearch = (!searchTerm || text.includes(searchTerm));

      if (matchesTab && matchesSelect && matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  orderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      orderTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTabStatus = tab.getAttribute('data-order-tab');
      filterOrders();
    });
  });

  orderSearchInput?.addEventListener('input', filterOrders);
  statusSelect?.addEventListener('change', filterOrders);

  if (selectAll) {
    selectAll.addEventListener('change', () => {
      const checkboxes = document.querySelectorAll('#orders-tbody input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
    });
  }
}

// Shop Filtering Logic (Manage Shops Page)
function initShopFiltering() {
  const shopRows = document.querySelectorAll('#shops-tbody tr');
  const shopSearchInput = document.getElementById('shop-search-input');
  const statusSelect = document.getElementById('filter-shop-status');
  const categorySelect = document.getElementById('filter-shop-category');
  const selectAllShops = document.getElementById('select-all-shops');
  const bulkCountSpan = document.querySelector('.bulk-btn-group span');
  const bulkActionBtns = document.querySelectorAll('.bulk-btn-group button');

  if (!shopRows.length) return;

  function filterShops() {
    const searchTerm = shopSearchInput ? shopSearchInput.value.toLowerCase().trim() : '';
    const selectedStatus = statusSelect ? statusSelect.value.toLowerCase() : 'all';
    const selectedCategory = categorySelect ? categorySelect.value.toLowerCase() : 'all';

    shopRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const matchesSearch = (!searchTerm || text.includes(searchTerm));
      const matchesStatus = (selectedStatus === 'all' || text.includes(selectedStatus));
      const matchesCategory = (selectedCategory === 'all' || text.includes(selectedCategory));

      if (matchesSearch && matchesStatus && matchesCategory) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  shopSearchInput?.addEventListener('input', filterShops);
  statusSelect?.addEventListener('change', filterShops);
  categorySelect?.addEventListener('change', filterShops);

  function updateBulkState() {
    const checked = document.querySelectorAll('#shops-tbody input[type="checkbox"]:checked').length;
    if (bulkCountSpan) bulkCountSpan.innerText = `${checked} selected`;
    bulkActionBtns.forEach(btn => {
      btn.disabled = checked === 0;
    });
  }

  if (selectAllShops) {
    selectAllShops.addEventListener('change', () => {
      const checkboxes = document.querySelectorAll('#shops-tbody input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = selectAllShops.checked);
      updateBulkState();
    });
  }

  document.querySelectorAll('#shops-tbody input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateBulkState);
  });
}

// SVG Line Charts Generator
function initLineCharts() {
  const shopChartSvg = document.getElementById('shop-views-chart');
  if (shopChartSvg) renderShopLineChart(shopChartSvg);

  const adminChartSvg = document.getElementById('admin-analytics-chart');
  if (adminChartSvg) renderAdminLineChart(adminChartSvg);
}

function renderShopLineChart(svg) {
  const points = [
    { label: '20 May', val: 200, x: 40, y: 160 },
    { label: '21 May', val: 380, x: 130, y: 120 },
    { label: '22 May', val: 300, x: 220, y: 140 },
    { label: '23 May', val: 520, x: 310, y: 90 },
    { label: '24 May', val: 700, x: 400, y: 50 },
    { label: '25 May', val: 450, x: 490, y: 105 },
    { label: '26 May', val: 850, x: 580, y: 20 }
  ];

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpX1 = (points[i-1].x + points[i].x) / 2;
    const cpY1 = points[i-1].y;
    const cpX2 = (points[i-1].x + points[i].x) / 2;
    const cpY2 = points[i].y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
  }

  const areaD = `${pathD} L ${points[points.length-1].x} 190 L ${points[0].x} 190 Z`;

  let svgContent = `
    <defs>
      <linearGradient id="shopGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#16a34a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#16a34a" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" stroke-dasharray="4" />
    <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" stroke-dasharray="4" />
    <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" stroke-dasharray="4" />
    <line x1="40" y1="170" x2="580" y2="170" stroke="#f1f5f9" stroke-dasharray="4" />
    <path d="${areaD}" fill="url(#shopGradient)" />
    <path d="${pathD}" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" />
  `;

  points.forEach(p => {
    svgContent += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#16a34a" stroke="#ffffff" stroke-width="2.5" class="chart-point">
        <title>${p.label}: ${p.val} Views</title>
      </circle>
    `;
  });

  svg.innerHTML = svgContent;
}

function renderAdminLineChart(svg) {
  const points = [
    { label: '20 May', val: '15K', x: 40, y: 160 },
    { label: '21 May', val: '28K', x: 130, y: 120 },
    { label: '22 May', val: '22K', x: 220, y: 140 },
    { label: '23 May', val: '38K', x: 310, y: 90 },
    { label: '24 May', val: '52K', x: 400, y: 45 },
    { label: '25 May', val: '35K', x: 490, y: 100 },
    { label: '26 May', val: '58K', x: 580, y: 25 }
  ];

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpX1 = (points[i-1].x + points[i].x) / 2;
    const cpY1 = points[i-1].y;
    const cpX2 = (points[i-1].x + points[i].x) / 2;
    const cpY2 = points[i].y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
  }

  const areaD = `${pathD} L ${points[points.length-1].x} 190 L ${points[0].x} 190 Z`;

  let svgContent = `
    <defs>
      <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#16a34a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#16a34a" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    <line x1="40" y1="25" x2="580" y2="25" stroke="#f1f5f9" stroke-dasharray="4" />
    <line x1="40" y1="75" x2="580" y2="75" stroke="#f1f5f9" stroke-dasharray="4" />
    <line x1="40" y1="125" x2="580" y2="125" stroke="#f1f5f9" stroke-dasharray="4" />
    <path d="${areaD}" fill="url(#adminGradient)" />
    <path d="${pathD}" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" />
  `;

  points.forEach(p => {
    svgContent += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#16a34a" stroke="#ffffff" stroke-width="2.5">
        <title>${p.label}: ${p.val} Visitors</title>
      </circle>
    `;
  });

  svg.innerHTML = svgContent;
}

// Donut Chart Generator
function initDonutChart() {
  const donutSvg = document.getElementById('platform-donut-chart');
  if (!donutSvg) return;

  const slices = [
    { color: '#16a34a', strokeDash: '35 150', strokeOffset: '0' },
    { color: '#9333ea', strokeDash: '28 150', strokeOffset: '-36' },
    { color: '#2563eb', strokeDash: '23 150', strokeOffset: '-65' },
    { color: '#ea580c', strokeDash: '18 150', strokeOffset: '-89' },
    { color: '#64748b', strokeDash: '82 150', strokeOffset: '-108' }
  ];

  let svgContent = `<svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width: 140px; height: 140px; margin: 0 auto; display: block;">`;
  slices.forEach(s => {
    svgContent += `<circle cx="50" cy="50" r="30" fill="transparent" stroke="${s.color}" stroke-width="12" stroke-dasharray="${s.strokeDash}" stroke-dashoffset="${s.strokeOffset}" />`;
  });
  svgContent += `</svg>`;
  donutSvg.innerHTML = svgContent;
}

// Pending Approvals Tab & Action Logic
function initPendingApprovals() {
  const tabs = document.querySelectorAll('.dash-tab-btn[data-tab]');
  const tableBody = document.getElementById('pending-approvals-tbody');
  if (!tableBody) return;

  const pendingData = {
    shops: [
      { id: 1, name: 'New Fashion World', owner: 'Rohit Kumar', loc: 'Gandhi Market, Rampur', date: '26 May 2024' },
      { id: 2, name: 'Tech World', owner: 'Aman Verma', loc: 'Civil Lines, Rampur', date: '26 May 2024' },
      { id: 3, name: 'Lucky Footwear', owner: 'Imran Ali', loc: 'Nai Sadak, Rampur', date: '25 May 2024' },
      { id: 4, name: 'Modern Electronics', owner: 'Sahil Khan', loc: 'Gandhi Market, Rampur', date: '25 May 2024' }
    ],
    products: [
      { id: 5, name: 'OnePlus 11R 5G', owner: 'Sharma Mobile', loc: 'Gandhi Market, Rampur', date: '26 May 2024' },
      { id: 6, name: 'Sony WH-1000XM5', owner: 'Modern Electronics', loc: 'Gandhi Market, Rampur', date: '25 May 2024' },
      { id: 7, name: 'Nike Air Max 270', owner: 'Khan Footwear', loc: 'Nai Sadak, Rampur', date: '24 May 2024' }
    ],
    banners: [
      { id: 8, name: 'Summer Sale Banner', owner: 'Fashion Hub', loc: 'Mandi Samiti, Rampur', date: '26 May 2024' },
      { id: 9, name: 'Monsoon Discounts', owner: 'Gupta General', loc: 'Civil Lines, Rampur', date: '25 May 2024' }
    ]
  };

  function renderTable(type) {
    const items = pendingData[type] || [];
    if (items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">No pending approvals</td></tr>`;
      return;
    }

    tableBody.innerHTML = items.map(item => `
      <tr id="pending-row-${item.id}">
        <td><strong>${item.name}</strong></td>
        <td>${item.owner}</td>
        <td>${item.loc}</td>
        <td>${item.date}</td>
        <td><span class="status-pill pending">Pending</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn-icon approve" onclick="handlePendingAction(${item.id}, 'approve')" title="Approve"><i class="fa-solid fa-check"></i></button>
            <button class="action-btn-icon reject" onclick="handlePendingAction(${item.id}, 'reject')" title="Reject"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTable(tab.getAttribute('data-tab'));
    });
  });

  renderTable('shops');
}

window.handlePendingAction = function(id, action) {
  const row = document.getElementById(`pending-row-${id}`);
  if (!row) return;

  if (action === 'approve') {
    row.style.background = '#dcfce7';
    row.innerHTML = `<td colspan="6" style="color: #166534; font-weight: 700; padding: 12px; text-align: center;">✅ Item Approved!</td>`;
    setTimeout(() => row.remove(), 1200);
  } else {
    row.style.background = '#fee2e2';
    row.innerHTML = `<td colspan="6" style="color: #991b1b; font-weight: 700; padding: 12px; text-align: center;">❌ Item Rejected</td>`;
    setTimeout(() => row.remove(), 1200);
  }
};

function initModals() {
  const addBtn = document.getElementById('btn-add-product');
  const modal = document.getElementById('add-product-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('add-product-form');

  if (!addBtn || !modal) return;

  addBtn.addEventListener('click', () => modal.style.display = 'flex');
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Product added successfully!');
    modal.style.display = 'none';
    form.reset();
  });
}
