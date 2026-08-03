const STORAGE_KEY = 'bean-bloom-products-v2';
const CATEGORY_STORAGE_KEY = 'bean-bloom-categories-v2';
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80';
const USER_SESSION_KEY = 'bean-bloom-user-session';
const SETTINGS_KEY = 'bean-bloom-site-settings';
const ORDERS_KEY = 'bean-bloom-orders'; // per-user: bean-bloom-orders-{userId}
const ADDRESS_KEY = 'bean-bloom-address'; // per-user: bean-bloom-address-{userId}
const DISCOUNTS_KEY = 'bean-bloom-discounts-v1';
const RECENTLY_VIEWED_KEY = 'bean-bloom-recently-viewed';
const WISHLIST_KEY = 'bean-bloom-wishlist';
const COMPARE_KEY = 'bean-bloom-compare';

const DEFAULT_SETTINGS = {
  siteName: 'Bean & Bloom',
  footerText: '© 2026 Bean & Bloom. Specialty coffee, calm spaces, and warm welcomes in Faridabad.',
  hero: {
    eyebrow: 'Specialty cafe & shop · Faridabad',
    headline: 'Handcrafted coffee for the bar and the kitchen counter.',
    subtext: 'Espresso, fresh bakery, seasonal beans, and brew gear — from our Market Street cafe to your morning ritual.',
    cta1Label: 'Shop the collection', cta1Url: '#products',
    cta2Label: 'View cafe menu', cta2Url: 'menu.html',
    tile1Badge: 'House favorite', tile1Title: 'Signature Espresso', tile1Desc: 'Bold, velvety, and dialed in every morning.',
    tile2Badge: 'Take home', tile2Title: 'Golden Morning Brew', tile2Desc: 'Bright single-origin for pour-over and drip.'
  },
  categorySection: { title: 'Shop by category', subtext: 'Cafe drinks, bakery, beans, and gear — browse what we pour and what we send home.' },
  featuredSection: { title: 'Featured picks', subtext: 'Staff favorites from the bar and the shelf.' },
  shopSection: { title: 'Shop the collection', subtext: 'Browse every bean, drink, bakery item, and brew tool in the cafe shop.' },
  deal: {
    eyebrow: 'Cafe special', title: 'Weekend Brunch Blend + Ceramic Mug',
    description: 'A mellow house blend paired with our signature mug — made for slow Saturday mornings at home or at the cafe counter.',
    price: '34.99', badge: 'Limited weekend set', ctaLabel: 'View special', ctaUrl: 'deal.html', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80'
  },
  testimonials: [
    {
      quote: 'My weekday stop for a ristretto and a quiet table. The beans I take home taste just as good.',
      author: 'Aarav Mehta, Designer',
      avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      quote: 'Friendly baristas, honest recommendations, and bakery that actually sells out by afternoon.',
      author: 'Ishita Sharma, Founder',
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      quote: 'Ordered a gift box online and picked up espresso gear in-store the same week. Seamless.',
      author: 'Rohan Verma, Consultant',
      avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  ],
  promoStrip: [
    { title: 'Local delivery', desc: 'Same-day bakery in Faridabad' },
    { title: 'Cafe pickup', desc: 'Order online, collect at the bar' },
    { title: 'Fresh roast', desc: 'Small-batch beans each week' },
    { title: 'Barista help', desc: 'Grind & brew advice anytime' }
  ],
  payments: {
    currency: 'INR',
    razorpayEnabled: true,
    razorpayKeyId: ''
  },
  cafe: {
    addressLine: '88 Market Street, Downtown',
    city: 'Faridabad',
    state: 'Haryana',
    pincode: '121002',
    phone: '+91 55501 42234',
    email: 'hello@beanandbloom.com',
    hoursWeekday: 'Mon – Fri · 7:00 am – 7:00 pm',
    hoursSaturday: 'Saturday · 8:00 am – 8:00 pm',
    hoursSunday: 'Sunday · 8:00 am – 6:00 pm',
    mapQuery: 'Faridabad Market',
    visitEyebrow: 'Cafe hours',
    visitHeadline: 'Come in for a cup, leave with a ritual.',
    visitSubtext: 'Open daily for espresso, pour-overs, bakery, and take-home beans. Remote-work tables available until mid-afternoon.'
  },
  about: {
    eyebrow: 'Our story',
    headline: 'Roasted with care. Served with calm.',
    intro: 'Bean & Bloom began as a neighborhood espresso counter and grew into a specialty cafe and shop for people who want better coffee at the bar and at home.',
    body1: 'We source seasonal lots, roast in small batches, and train every barista on dial-in, milk texture, and hospitality. The goal is simple: a cup that feels intentional, whether you stay for twenty minutes or take beans home for the week.',
    body2: 'Alongside drinks, our shop carries brew gear, gift boxes, and bakery made fresh each morning — so one stop covers your cafe visit and your home setup.',
    value1Title: 'Thoughtful sourcing',
    value1Desc: 'We work with importers who share farm details, processing notes, and roast-ready profiles we can stand behind.',
    value2Title: 'Warm service',
    value2Desc: 'Ask for a recommendation, a grind setting, or a quieter table — the team is here to make the visit easy.',
    value3Title: 'Cafe + home',
    value3Desc: 'Drink in, take away, or shop beans and tools for mornings that start the same way ours do.'
  },
  newsletter: {
    eyebrow: 'Stay in the loop',
    headline: 'Weekly roast notes & cafe specials',
    subtext: 'No spam — just brew guides, seasonal drinks, and early access to limited bags.'
  },
  menuCategories: ['Espresso', 'Bakery & Snacks', 'Tea & Infusions', 'Cold Brew'],
  seo: {
    defaultTitle: 'Bean & Bloom | Specialty Coffee Cafe & Shop',
    defaultDescription: 'Shop specialty coffee, brew gear, bakery, and cafe essentials from Bean & Bloom Faridabad. Order online for delivery or cafe pickup.',
    keywords: 'specialty coffee, Faridabad cafe, espresso beans, pour over, cold brew, coffee gifts',
    ogImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    canonicalBase: '',
    robots: 'index,follow',
    twitterHandle: '@beanandbloom'
  }
};

let settingsCache = null;
let productsCache = null;
let categoriesCache = null;

function loadSettings() {
  if (settingsCache) return settingsCache;
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (!saved) {
      settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      return settingsCache;
    }
    // Deep merge to add any new keys from DEFAULT_SETTINGS
    settingsCache = {
      ...DEFAULT_SETTINGS, ...saved,
      hero: { ...DEFAULT_SETTINGS.hero, ...(saved.hero || {}) },
      categorySection: { ...DEFAULT_SETTINGS.categorySection, ...(saved.categorySection || {}) },
      featuredSection: { ...DEFAULT_SETTINGS.featuredSection, ...(saved.featuredSection || {}) },
      shopSection: { ...DEFAULT_SETTINGS.shopSection, ...(saved.shopSection || {}) },
      deal: { ...DEFAULT_SETTINGS.deal, ...(saved.deal || {}) },
      testimonials: Array.isArray(saved.testimonials)
        ? saved.testimonials.map((item, index) => ({
            ...DEFAULT_SETTINGS.testimonials[index % DEFAULT_SETTINGS.testimonials.length],
            ...(item || {})
          }))
        : DEFAULT_SETTINGS.testimonials,
      promoStrip: saved.promoStrip || DEFAULT_SETTINGS.promoStrip,
      payments: { ...DEFAULT_SETTINGS.payments, ...(saved.payments || {}) },
      cafe: { ...DEFAULT_SETTINGS.cafe, ...(saved.cafe || {}) },
      about: { ...DEFAULT_SETTINGS.about, ...(saved.about || {}) },
      newsletter: { ...DEFAULT_SETTINGS.newsletter, ...(saved.newsletter || {}) },
      seo: { ...DEFAULT_SETTINGS.seo, ...(saved.seo || {}) },
      menuCategories: Array.isArray(saved.menuCategories) && saved.menuCategories.length
        ? saved.menuCategories
        : DEFAULT_SETTINGS.menuCategories
    };
    return settingsCache;
  } catch {
    settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    return settingsCache;
  }
}

function saveSettings(settings) {
  settingsCache = settings;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function resetSettingsToDefaults() {
  settingsCache = null;
  localStorage.removeItem(SETTINGS_KEY);
  return loadSettings();
}

const ADMIN_SESSION_KEY = 'bean-bloom-admin';
const CUSTOMERS_KEY = 'bean-bloom-customers-v1';
const LOCAL_INQUIRIES_KEY = 'bean-bloom-inquiries-local';

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function setAdminLoggedIn(value) {
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function ensureAdminAccess() {
  const page = document.body?.dataset?.adminPage;
  if (!page) return true;

  const loginForm = document.getElementById('login-form');
  const adminPanel = document.getElementById('admin-panel');
  const logoutBtn = document.getElementById('logout-btn');

  if (isAdminLoggedIn()) {
    document.body.classList.add('admin-authed');
    if (loginForm) loginForm.classList.add('hide');
    if (adminPanel) adminPanel.classList.remove('hide');
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-block';
      if (!logoutBtn.dataset.bound) {
        logoutBtn.dataset.bound = '1';
        logoutBtn.addEventListener('click', () => {
          setAdminLoggedIn(false);
          document.body.classList.remove('admin-authed');
          window.location.replace('admin.html');
        });
      }
    }
    return true;
  }

  document.body.classList.remove('admin-authed');
  if (loginForm && adminPanel) {
    loginForm.classList.remove('hide');
    adminPanel.classList.add('hide');
    if (logoutBtn) logoutBtn.style.display = 'none';
    return false;
  }

  const file = (location.pathname.split('/').pop() || 'admin.html').replace(/[^\w.-]/g, '');
  const search = location.search || '';
  const next = /^admin[\w.-]*\.html$/.test(file) ? `${file}${search}` : 'admin.html';
  window.location.replace(`admin.html?next=${encodeURIComponent(next)}`);
  return false;
}

function loadRegisteredCustomers() {
  try {
    const list = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function loadAllOrders() {
  const orders = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(`${ORDERS_KEY}-`)) continue;
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) continue;
      list.forEach((order) => {
        orders.push({
          ...order,
          _storageKey: key,
          _customerId: key.slice(`${ORDERS_KEY}-`.length)
        });
      });
    } catch {}
  }
  return orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}


function filterOrdersByDateRange(orders, fromValue, toValue) {
  const list = Array.isArray(orders) ? orders : [];
  const from = fromValue ? new Date(`${fromValue}T00:00:00`) : null;
  const to = toValue ? new Date(`${toValue}T23:59:59.999`) : null;
  return list.filter((order) => {
    const d = new Date(order.date || 0);
    if (Number.isNaN(d.getTime())) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

function toInputDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function setDateRangePreset(fromId, toId, days) {
  const to = new Date();
  const from = new Date();
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);
  if (days === 'all') {
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    return;
  }
  from.setDate(to.getDate() - (Number(days) || 30) + 1);
  if (fromEl) fromEl.value = toInputDate(from);
  if (toEl) toEl.value = toInputDate(to);
}

function buildBarChart(rows, { maxBars = 14 } = {}) {
  const data = (rows || []).slice(-maxBars);
  const max = Math.max(...data.map((row) => Number(row.value) || 0), 1);
  if (!data.length) return '<p class="muted">No data in this range.</p>';
  return `<div class="analytics-bars" role="img" aria-label="Bar chart">${data.map((row) => {
    const height = Math.max(6, Math.round((Number(row.value) || 0) / max * 100));
    return `<div class="analytics-bar-col" title="${escapeHtml(row.label)}: ${escapeHtml(String(row.display || row.value))}"><div class="analytics-bar" style="height:${height}%"></div><span>${escapeHtml(row.short || row.label)}</span></div>`;
  }).join('')}</div>`;
}

function buildProgressRows(entries) {
  const list = entries || [];
  const max = Math.max(...list.map((row) => Number(row.value) || 0), 1);
  if (!list.length) return '<p class="muted">No data yet.</p>';
  return list.map((row) => {
    const pct = Math.round((Number(row.value) || 0) / max * 100);
    return `<div class="analytics-progress-row"><div class="summary-row" style="margin-bottom:.25rem;"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.display || String(row.value))}</strong></div><div class="analytics-progress-track"><div class="analytics-progress-fill" style="width:${pct}%"></div></div></div>`;
  }).join('');
}

function loadWishlist() {
  try { const list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); return Array.isArray(list) ? list.map(String) : []; } catch { return []; }
}
function saveWishlist(ids) { localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(new Set(ids.map(String))))); }
function toggleWishlist(productId) {
  const id = String(productId || ''); if (!id) return false;
  const list = loadWishlist();
  const next = list.includes(id) ? list.filter((item) => item !== id) : [id, ...list].slice(0, 60);
  saveWishlist(next); return next.includes(id);
}
function loadRecentlyViewed() {
  try { const list = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); return Array.isArray(list) ? list.map(String) : []; } catch { return []; }
}
function pushRecentlyViewed(productId) {
  const id = String(productId || ''); if (!id) return;
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([id, ...loadRecentlyViewed().filter((item) => item !== id)].slice(0, 12)));
}
function loadCompareList() {
  try { const list = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]'); return Array.isArray(list) ? list.map(String) : []; } catch { return []; }
}
function toggleCompare(productId) {
  const id = String(productId || ''); if (!id) return loadCompareList();
  let list = loadCompareList();
  if (list.includes(id)) list = list.filter((item) => item !== id);
  else {
    if (list.length >= 3) { showToast('Compare up to 3 products at a time.', 'info'); return list; }
    list = [...list, id];
  }
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  renderCompareBar();
  return list;
}
function renderCompareBar() {
  let bar = document.getElementById('compare-bar');
  const ids = loadCompareList();
  if (!ids.length) { if (bar) bar.remove(); return; }
  const products = loadProducts().filter((p) => ids.includes(String(p.id)));
  if (!bar) { bar = document.createElement('div'); bar.id = 'compare-bar'; bar.className = 'compare-bar'; document.body.appendChild(bar); }
  bar.innerHTML = `<div class="compare-bar-inner"><strong>Compare (${products.length}/3)</strong><div class="compare-bar-items">${products.map((p) => `<span>${escapeHtml(p.name)}</span>`).join('')}</div><div class="compare-bar-actions"><button class="btn" type="button" id="compare-open-btn" ${products.length < 2 ? 'disabled' : ''}>Compare</button><button class="btn secondary" type="button" id="compare-clear-btn">Clear</button></div></div>`;
  document.getElementById('compare-clear-btn')?.addEventListener('click', () => { localStorage.setItem(COMPARE_KEY, '[]'); renderCompareBar(); renderPublicProducts(); });
  document.getElementById('compare-open-btn')?.addEventListener('click', () => openCompareModal(products));
}
function openCompareModal(products) {
  let modal = document.getElementById('compare-modal');
  if (!modal) { modal = document.createElement('div'); modal.id = 'compare-modal'; modal.className = 'compare-modal'; document.body.appendChild(modal); }
  modal.innerHTML = `<div class="compare-modal-card"><div class="section-head"><h3 style="margin:0;">Compare products</h3><button class="btn secondary" type="button" id="compare-close-btn" style="margin:0;">Close</button></div><div class="compare-table">${['Name','Category','Price','Stock','Description'].map((label, idx) => `<div class="compare-row"><strong>${label}</strong>${products.map((p) => { const values=[p.name,p.category||'—',formatCurrencyAmount(Number(p.price)),Number(p.stock)>0?`${p.stock} left`:'Out of stock',p.description||'—']; return `<span>${escapeHtml(values[idx])}</span>`; }).join('')}</div>`).join('')}</div></div>`;
  modal.classList.add('show');
  document.getElementById('compare-close-btn')?.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
}

function updateStoredOrder(orderId, updater) {
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(`${ORDERS_KEY}-`)) continue;
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) continue;
      const index = list.findIndex((item) => item.id === orderId);
      if (index < 0) continue;
      list[index] = updater(list[index]);
      localStorage.setItem(key, JSON.stringify(list));
      return list[index];
    } catch {}
  }
  return null;
}

function loadLocalInquiries() {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

const PAYMENT_METHOD_META = {
  razorpay: { icon: '⚡', label: 'Razorpay Checkout', short: 'Razorpay' }
};

function getPaymentSettings() {
  return loadSettings().payments || DEFAULT_SETTINGS.payments;
}

function getPaymentMethodLabel(method) {
  return PAYMENT_METHOD_META[method]?.label || String(method || 'Razorpay');
}

function getPaymentMethodIcon(method) {
  return PAYMENT_METHOD_META[method]?.icon || '⚡';
}

function getEnabledPaymentMethods(pay = getPaymentSettings()) {
  if (pay.razorpayEnabled === false) return [];
  return [{
    id: 'razorpay',
    icon: PAYMENT_METHOD_META.razorpay.icon,
    label: PAYMENT_METHOD_META.razorpay.label,
    sub: pay.razorpayKeyId
      ? 'Cards, UPI, Net Banking & wallets via Razorpay'
      : 'Add your Razorpay Key ID in Admin → Settings'
  }];
}

function loadDiscounts() {
  try {
    const saved = JSON.parse(localStorage.getItem(DISCOUNTS_KEY) || '[]');
    return Array.isArray(saved) ? saved.map(normalizeDiscount).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveDiscounts(discounts) {
  const list = (Array.isArray(discounts) ? discounts : []).map(normalizeDiscount).filter(Boolean);
  localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(list));
  return list;
}

function normalizeDiscount(discount) {
  if (!discount || typeof discount !== 'object') return null;
  const type = ['store', 'category', 'product'].includes(discount.type) ? discount.type : 'store';
  const valueType = discount.valueType === 'fixed' ? 'fixed' : 'percent';
  const value = Math.max(0, Number(discount.value) || 0);
  if (!value) return null;
  return {
    id: discount.id || `disc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: String(discount.name || 'Discount').trim() || 'Discount',
    type,
    valueType,
    value,
    category: String(discount.category || '').trim(),
    productId: String(discount.productId || '').trim(),
    code: String(discount.code || '').trim().toUpperCase(),
    active: discount.active !== false,
    startsAt: discount.startsAt || '',
    endsAt: discount.endsAt || '',
    createdAt: discount.createdAt || new Date().toISOString()
  };
}

function isDiscountActive(discount, now = new Date()) {
  if (!discount || discount.active === false) return false;
  if (discount.startsAt && new Date(discount.startsAt) > now) return false;
  if (discount.endsAt && new Date(discount.endsAt) < now) return false;
  return true;
}

function getActiveDiscounts() {
  return loadDiscounts().filter((d) => isDiscountActive(d));
}

/**
 * Apply best-matching discounts to a cart.
 * Priority: product > category > store-wide. Only one discount per line + one store discount.
 */
function calculateCartPricing(cartItems = []) {
  const items = Array.isArray(cartItems) ? cartItems : [];
  const discounts = getActiveDiscounts();
  const productDiscounts = discounts.filter((d) => d.type === 'product');
  const categoryDiscounts = discounts.filter((d) => d.type === 'category');
  const storeDiscounts = discounts.filter((d) => d.type === 'store');

  const lineDetails = items.map((item) => {
    const lineSubtotal = Number(item.price || 0) * Number(item.quantity || 0);
    const productMatch = productDiscounts.find((d) => d.productId && d.productId === String(item.id));
    const categoryMatch = categoryDiscounts.find((d) => d.category && d.category.toLowerCase() === String(item.category || '').toLowerCase());
    const applied = productMatch || categoryMatch || null;
    let lineDiscount = 0;
    if (applied) {
      lineDiscount = applied.valueType === 'fixed'
        ? Math.min(lineSubtotal, applied.value * Number(item.quantity || 0))
        : lineSubtotal * (applied.value / 100);
    }
    return {
      ...item,
      lineSubtotal,
      lineDiscount,
      appliedDiscount: applied
    };
  });

  const subtotal = lineDetails.reduce((sum, row) => sum + row.lineSubtotal, 0);
  const itemDiscountTotal = lineDetails.reduce((sum, row) => sum + row.lineDiscount, 0);
  const afterItemDiscounts = Math.max(0, subtotal - itemDiscountTotal);

  let storeDiscount = null;
  let storeDiscountAmount = 0;
  if (storeDiscounts.length && afterItemDiscounts > 0) {
    storeDiscount = storeDiscounts.reduce((best, current) => {
      const bestAmt = best.valueType === 'fixed' ? best.value : afterItemDiscounts * (best.value / 100);
      const curAmt = current.valueType === 'fixed' ? current.value : afterItemDiscounts * (current.value / 100);
      return curAmt > bestAmt ? current : best;
    });
    storeDiscountAmount = storeDiscount.valueType === 'fixed'
      ? Math.min(afterItemDiscounts, storeDiscount.value)
      : afterItemDiscounts * (storeDiscount.value / 100);
  }

  const discountTotal = itemDiscountTotal + storeDiscountAmount;
  const total = Math.max(0, subtotal - discountTotal);
  return {
    items: lineDetails,
    subtotal,
    itemDiscountTotal,
    storeDiscount,
    storeDiscountAmount,
    discountTotal,
    total,
    applied: [
      ...lineDetails.filter((row) => row.appliedDiscount).map((row) => ({
        scope: row.appliedDiscount.type,
        name: row.appliedDiscount.name,
        amount: row.lineDiscount,
        productId: row.id
      })),
      ...(storeDiscount ? [{ scope: 'store', name: storeDiscount.name, amount: storeDiscountAmount }] : [])
    ]
  };
}

// Sets text/href/src of element by id if it exists
function setEl(id, value, attr = 'text') {
  const el = document.getElementById(id);
  if (!el) return;
  if (attr === 'text') el.textContent = value;
  else if (attr === 'html') el.innerHTML = value;
  else el.setAttribute(attr, value);
}

function showToast(message, type = 'info') {
  let stack = document.getElementById('toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'toast-stack';
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity .25s ease, transform .25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav') || document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => observer.observe(el));
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const emailInput = document.getElementById('newsletter-email');
  const status = document.getElementById('newsletter-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = String(emailInput?.value || '').trim();
    if (!email) {
      if (status) status.textContent = 'Enter a valid email address.';
      return;
    }
    try {
      const key = 'bean-bloom-newsletter';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const list = Array.isArray(existing) ? existing : [];
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    form.reset();
    if (status) status.textContent = 'You’re on the list. Watch for roast notes soon.';
    showToast('Subscribed to Bean & Bloom updates.', 'success');
  });
}

function initShopControls() {
  const search = document.getElementById('product-search');
  const sort = document.getElementById('product-sort');
  const priceMin = document.getElementById('filter-price-min');
  const priceMax = document.getElementById('filter-price-max');
  const inStock = document.getElementById('filter-in-stock');
  const categoryChips = document.getElementById('shop-category-chips');
  const clearBtn = document.getElementById('shop-clear-filters');
  const rerender = () => {
    renderPublicProducts({
      searchQuery: search?.value || '',
      sortBy: sort?.value || 'featured',
      priceMin: priceMin?.value,
      priceMax: priceMax?.value,
      inStockOnly: !!inStock?.checked,
      categoryChip: document.querySelector('[data-shop-category].is-active')?.getAttribute('data-shop-category') || ''
    });
  };
  if (categoryChips && !categoryChips.dataset.bound) {
    categoryChips.dataset.bound = 'true';
    categoryChips.innerHTML = ['All', ...loadCategories()].map((cat, i) => `<button type="button" class="shop-chip${i === 0 ? ' is-active' : ''}" data-shop-category="${cat === 'All' ? '' : escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('');
    categoryChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-shop-category]');
      if (!btn) return;
      categoryChips.querySelectorAll('.shop-chip').forEach((el) => el.classList.remove('is-active'));
      btn.classList.add('is-active');
      rerender();
    });
  }
  if (!search && !sort && !categoryChips && !priceMin) return;
  search?.addEventListener('input', rerender);
  sort?.addEventListener('change', rerender);
  priceMin?.addEventListener('change', rerender);
  priceMax?.addEventListener('change', rerender);
  inStock?.addEventListener('change', rerender);
  clearBtn?.addEventListener('click', () => {
    if (search) search.value = '';
    if (sort) sort.value = 'featured';
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    if (inStock) inStock.checked = false;
    categoryChips?.querySelectorAll('.shop-chip').forEach((el, i) => el.classList.toggle('is-active', i === 0));
    rerender();
  });
  const q = new URLSearchParams(window.location.search).get('q');
  if (q && search) search.value = q;
}

function renderCafeMenu(activeFilter = 'all') {
  const root = document.getElementById('cafe-menu');
  if (!root) return;

  const settings = loadSettings();
  const menuCategories = (settings.menuCategories || DEFAULT_SETTINGS.menuCategories).filter(Boolean);
  const products = loadProducts().filter((product) => menuCategories.includes(product.category));
  const filtered = activeFilter === 'all'
    ? products
    : products.filter((product) => product.category === activeFilter);

  if (!filtered.length) {
    root.innerHTML = '<div class="card"><p class="muted">Menu items will appear here once cafe categories are stocked.</p></div>';
    return;
  }

  const groups = {};
  filtered.forEach((product) => {
    const key = product.category || 'Menu';
    if (!groups[key]) groups[key] = [];
    groups[key].push(product);
  });

  root.innerHTML = Object.entries(groups).map(([category, items]) => `
    <div class="menu-group reveal is-visible">
      <h2>${escapeHtml(category)}</h2>
      ${items.map((item) => `
        <article class="menu-item">
          <img src="${escapeHtml(optimizeImageUrl(item.imageUrl || DEFAULT_IMAGE_URL, 180, 70))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description || '')}</p>
          </div>
          <div style="display:grid;gap:.55rem;justify-items:end;">
            <span class="price">${formatCurrencyAmount(Number(item.price))}</span>
            <button class="btn secondary" type="button" data-menu-add="${escapeHtml(item.id)}" style="margin:0;padding:.55rem .9rem;font-size:.85rem;">Add</button>
          </div>
        </article>
      `).join('')}
    </div>
  `).join('');

  root.querySelectorAll('[data-menu-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-menu-add');
      const product = loadProducts().find((item) => item.id === id);
      const added = addToCart(id);
      if (added) showToast(`${product?.name || 'Item'} added to cart.`, 'success');
    });
  });
}

function initCafeMenuFilters() {
  const toolbar = document.getElementById('menu-filters');
  if (!toolbar) return;
  const settings = loadSettings();
  const menuCategories = (settings.menuCategories || DEFAULT_SETTINGS.menuCategories).filter(Boolean);
  toolbar.innerHTML = [
    '<button class="menu-chip active" type="button" data-menu-filter="all">All</button>',
    ...menuCategories.map((category) => {
      const label = category === 'Bakery & Snacks' ? 'Bakery' : category === 'Tea & Infusions' ? 'Tea' : category;
      return `<button class="menu-chip" type="button" data-menu-filter="${escapeHtml(category)}">${escapeHtml(label)}</button>`;
    })
  ].join('');
  renderCafeMenu('all');
  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-menu-filter]');
    if (!button) return;
    toolbar.querySelectorAll('.menu-chip').forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    renderCafeMenu(button.getAttribute('data-menu-filter') || 'all');
  });
}

function applySeoMeta(settings = loadSettings()) {
  const seo = { ...DEFAULT_SETTINGS.seo, ...(settings.seo || {}) };
  const pageTitleOverride = document.body?.dataset?.seoTitle;
  const pageDescOverride = document.body?.dataset?.seoDescription;
  const title = pageTitleOverride || seo.defaultTitle || settings.siteName || 'Bean & Bloom';
  const description = pageDescOverride || seo.defaultDescription || '';
  if (title) document.title = title;
  const ensureMeta = (selector, attrs) => {
    let el = document.head.querySelector(selector);
    if (!el) { el = document.createElement('meta'); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); document.head.appendChild(el); }
    return el;
  };
  ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', description);
  ensureMeta('meta[name="keywords"]', { name: 'keywords' }).setAttribute('content', seo.keywords || '');
  ensureMeta('meta[name="robots"]', { name: 'robots' }).setAttribute('content', seo.robots || 'index,follow');
  ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title);
  ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', description);
  ensureMeta('meta[property="og:type"]', { property: 'og:type' }).setAttribute('content', 'website');
  if (seo.ogImage) ensureMeta('meta[property="og:image"]', { property: 'og:image' }).setAttribute('content', seo.ogImage);
  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }).setAttribute('content', 'summary_large_image');
  if (seo.twitterHandle) ensureMeta('meta[name="twitter:site"]', { name: 'twitter:site' }).setAttribute('content', seo.twitterHandle);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
  const base = String(seo.canonicalBase || '').replace(/\/$/, '');
  const pathName = window.location.pathname.split('/').pop() || 'index.html';
  canonical.setAttribute('href', base ? `${base}/${pathName}${window.location.search}` : window.location.href.split('#')[0]);
  let ld = document.getElementById('seo-jsonld');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'seo-jsonld'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: settings.siteName || 'Bean & Bloom', url: base || undefined, image: seo.ogImage || undefined },
      { '@type': 'WebSite', name: settings.siteName || 'Bean & Bloom', url: base || undefined, potentialAction: { '@type': 'SearchAction', target: `${base || ''}/index.html?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }
    ]
  });
}

function renderPublicSiteContent() {
  const s = loadSettings();
  applySeoMeta(s);

  // Brand name
  document.querySelectorAll('.brand').forEach(el => { if (el.closest('.site-header') || el.closest('.site-footer')) el.textContent = s.siteName; });
  document.querySelectorAll('.brand-name').forEach(el => { el.textContent = s.siteName; });
  setEl('hero-brand', s.siteName);

  // Hero
  setEl('hero-eyebrow', s.hero.eyebrow);
  setEl('hero-headline', s.hero.headline);
  setEl('hero-subtext', s.hero.subtext);
  const cta1 = document.getElementById('hero-cta1');
  if (cta1) { cta1.textContent = s.hero.cta1Label; cta1.href = s.hero.cta1Url; }
  const cta2 = document.getElementById('hero-cta2');
  if (cta2) { cta2.textContent = s.hero.cta2Label; cta2.href = s.hero.cta2Url; }
  setEl('tile1-badge', s.hero.tile1Badge);
  setEl('tile1-title', s.hero.tile1Title);
  setEl('tile1-desc', s.hero.tile1Desc);
  setEl('tile2-badge', s.hero.tile2Badge);
  setEl('tile2-title', s.hero.tile2Title);
  setEl('tile2-desc', s.hero.tile2Desc);

  // Category section headings
  setEl('cat-section-title', s.categorySection.title);
  setEl('cat-section-sub', s.categorySection.subtext);

  // Featured + shop section headings
  setEl('featured-section-title', s.featuredSection.title);
  setEl('featured-section-sub', s.featuredSection.subtext === 'Highlighted selections from the admin-managed collection.' ? '' : s.featuredSection.subtext);
  setEl('shop-section-title', s.shopSection?.title || DEFAULT_SETTINGS.shopSection.title);
  setEl('shop-section-sub', s.shopSection?.subtext || DEFAULT_SETTINGS.shopSection.subtext);

  // Deal of the day
  setEl('deal-eyebrow', s.deal.eyebrow);
  setEl('deal-title', s.deal.title);
  setEl('deal-desc', s.deal.description);
  setEl('deal-price', formatCurrency(s.deal.price));
  setEl('deal-badge', s.deal.badge);
  const dealCta = document.getElementById('deal-cta');
  if (dealCta) {
    dealCta.textContent = s.deal.ctaLabel;
    dealCta.href = s.deal.ctaUrl === '#products' ? 'deal.html' : s.deal.ctaUrl;
  }
  const dealImg = document.getElementById('deal-image');
  if (dealImg) dealImg.style.backgroundImage = s.deal.imageUrl ? `url('${escapeHtml(s.deal.imageUrl)}')` : '';

  // Testimonials
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = s.testimonials.map((t, i) => `
      <article class="card testimonial-card">
        <p>"${escapeHtml(t.quote)}"</p>
        <div class="testimonial-person">
          <img class="testimonial-avatar" src="${escapeHtml(optimizeImageUrl(t.avatarUrl || DEFAULT_SETTINGS.testimonials[i % DEFAULT_SETTINGS.testimonials.length].avatarUrl, 96, 70))}" alt="${escapeHtml(t.author)}" loading="lazy" decoding="async">
          <strong>— ${escapeHtml(t.author)}</strong>
        </div>
      </article>`).join('');
  }

  // Promo strip
  const promoGrid = document.getElementById('promo-grid');
  if (promoGrid) {
    promoGrid.innerHTML = s.promoStrip.map(p => `
      <article class="promo-item compact">
        <strong>${escapeHtml(p.title)}</strong>
        <span>${escapeHtml(p.desc)}</span>
      </article>`).join('');
  }

  // Cafe / visit / contact
  const cafe = s.cafe || DEFAULT_SETTINGS.cafe;
  const fullAddress = [cafe.addressLine, cafe.city, cafe.state, cafe.pincode].filter(Boolean).join(', ');
  setEl('visit-eyebrow', cafe.visitEyebrow);
  setEl('visit-headline', cafe.visitHeadline);
  setEl('visit-subtext', cafe.visitSubtext);
  setEl('hours-weekday', cafe.hoursWeekday);
  setEl('hours-saturday', cafe.hoursSaturday);
  setEl('hours-sunday', cafe.hoursSunday);
  setEl('hours-location', fullAddress || cafe.city);
  setEl('contact-address', [cafe.addressLine, `${cafe.city}${cafe.state ? `, ${cafe.state}` : ''} ${cafe.pincode || ''}`.trim()].filter(Boolean).join('\n'));
  const contactAddressEl = document.getElementById('contact-address');
  if (contactAddressEl) {
    contactAddressEl.innerHTML = `${escapeHtml(cafe.addressLine || '')}<br>${escapeHtml([cafe.city, cafe.state, cafe.pincode].filter(Boolean).join(', '))}`;
  }
  setEl('contact-hours', [cafe.hoursWeekday, cafe.hoursSaturday, cafe.hoursSunday].filter(Boolean).join('\n'));
  const contactHoursEl = document.getElementById('contact-hours');
  if (contactHoursEl) {
    contactHoursEl.innerHTML = [cafe.hoursWeekday, cafe.hoursSaturday, cafe.hoursSunday]
      .filter(Boolean)
      .map((line) => escapeHtml(line))
      .join('<br>');
  }
  setEl('contact-email', cafe.email);
  setEl('contact-phone', cafe.phone);
  const mapFrame = document.getElementById('contact-map');
  if (mapFrame && cafe.mapQuery) {
    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(cafe.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }

  // About page
  const about = s.about || DEFAULT_SETTINGS.about;
  setEl('about-eyebrow', about.eyebrow);
  setEl('about-headline', about.headline);
  setEl('about-intro', about.intro);
  setEl('about-body-1', about.body1);
  setEl('about-body-2', about.body2);
  setEl('about-value1-title', about.value1Title);
  setEl('about-value1-desc', about.value1Desc);
  setEl('about-value2-title', about.value2Title);
  setEl('about-value2-desc', about.value2Desc);
  setEl('about-value3-title', about.value3Title);
  setEl('about-value3-desc', about.value3Desc);

  // Newsletter
  const newsletter = s.newsletter || DEFAULT_SETTINGS.newsletter;
  setEl('newsletter-eyebrow', newsletter.eyebrow);
  setEl('newsletter-headline', newsletter.headline);
  setEl('newsletter-subtext', newsletter.subtext);

  // Footer — only branded footer text nodes, not every paragraph
  document.querySelectorAll('[data-footer-text], #footer-text').forEach((el) => {
    el.textContent = s.footerText;
  });
}

function renderDealPage() {
  const root = document.getElementById('deal-page');
  if (!root) return;

  const settings = loadSettings();
  const deal = settings.deal;
  const dealImage = deal.imageUrl ? escapeHtml(optimizeImageUrl(deal.imageUrl, 960, 74)) : escapeHtml(optimizeImageUrl(DEFAULT_IMAGE_URL, 960, 74));
  const ctaUrl = deal.ctaUrl === '#products' ? 'index.html#products' : deal.ctaUrl;

  root.innerHTML = `
    <section class="section deal-page-hero">
      <div class="container deal-page-grid">
        <div class="deal-page-copy">
          <span class="eyebrow">${escapeHtml(deal.eyebrow || 'Deal')}</span>
          <h1>${escapeHtml(deal.title || 'Featured deal')}</h1>
          <p class="muted">${escapeHtml(deal.description || 'A limited-time featured offer from our curated collection.')}</p>
          <div class="deal-meta">
            <strong>${escapeHtml(formatCurrency(deal.price || 0))}</strong>
            <span class="badge">${escapeHtml(deal.badge || 'Limited time')}</span>
          </div>
          <div class="hero-actions">
            <a class="btn" href="${escapeHtml(ctaUrl)}">${escapeHtml(deal.ctaLabel || 'Shop now')}</a>
            <a class="btn secondary" href="index.html#products">Browse products</a>
          </div>
        </div>
        <div class="deal-page-visual">
          <img src="${dealImage}" alt="${escapeHtml(deal.title || 'Deal image')}" loading="eager" decoding="async" fetchpriority="high">
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container deal-benefits-grid">
        <article class="card">
          <span class="badge">Why it stands out</span>
          <h3>Curated for daily use</h3>
          <p class="muted">A practical, premium pick that balances performance, design, and dependable everyday value.</p>
        </article>
        <article class="card">
          <span class="badge">Fast delivery</span>
          <h3>Ready to ship</h3>
          <p class="muted">Order with confidence and get a smooth checkout experience, secure payment, and fast delivery support.</p>
        </article>
        <article class="card">
          <span class="badge">Trusted choice</span>
          <h3>Backed by our store</h3>
          <p class="muted">Every featured deal is selected from the same catalog quality standards used across the storefront.</p>
        </article>
      </div>
    </section>
  `;
}

const defaultCategories = [
  'Espresso',
  'Espresso Gear',
  'Beans & Blends',
  'Coffee Machines',
  'Barista Tools',
  'Cold Brew',
  'Pour Over',
  'Tea & Infusions',
  'Bakery & Snacks',
  'Gift Boxes',
  'Coffee Capsules',
  'Merchandise',
  'Accessories',
  'Ready to Drink'
];

const seedCatalog = {
  'Espresso': [
    { name: 'Signature Espresso', price: 4.5, description: 'Bold and velvety with caramel notes.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
    { name: 'Double Ristretto', price: 4.9, description: 'Short pull espresso with intense aroma and sweetness.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Hazelnut Espresso', price: 5.1, description: 'Nutty and smooth espresso with toasted hazelnut notes.', imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' },
    { name: 'Vanilla Bean Shot', price: 4.8, description: 'Classic espresso balanced with warm vanilla flavor.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Midnight Espresso', price: 5.3, description: 'Dark roast profile with cocoa finish and rich crema.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cortado Classic', price: 5.2, description: 'Equal parts espresso and steamed milk for a soft finish.', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80' },
    { name: 'Affogato Shot', price: 5.75, description: 'Espresso poured over a scoop of vanilla gelato.', imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=80' },
    { name: 'Spice Market Espresso', price: 5.4, description: 'Cardamom-kissed espresso with warm bakery spice.', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80' },
    { name: 'Honeycomb Flat White', price: 5.6, description: 'Microfoam milk with a touch of honeycomb syrup.', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80' },
    { name: 'Single Origin Flight', price: 8.5, description: 'Three tasting shots from rotating farm lots.', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80' }
  ],
  'Espresso Gear': [
    { name: 'Precision Tamper', price: 39.99, description: 'Balanced stainless-steel tamper for even extraction.', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80' },
    { name: 'Milk Frothing Pitcher', price: 24.5, description: 'Barista pitcher with sharp spout for latte art.', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bottomless Portafilter', price: 54.0, description: 'Improve shot diagnostics with a naked portafilter.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Knock Box Pro', price: 29.99, description: 'Compact puck knock box with anti-slip base.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'Distribution Tool', price: 34.75, description: 'Level and distribute grounds for consistent shots.', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80' },
    { name: 'WDT Needle Tool', price: 22.5, description: 'Weiss Distribution Technique needles for clump-free pucks.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Puck Screen 58mm', price: 18.0, description: 'Stainless screen for cleaner shower and even flow.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Tamping Mat', price: 16.5, description: 'Corner mat that protects counters during tamping.', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Group Head Gasket Kit', price: 12.99, description: 'Spare gaskets and screws for common home machines.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'Calibrated Spring Tamper', price: 64.0, description: 'Consistent 30 lb pressure every tamp.', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80' }
  ],
  'Beans & Blends': [
    { name: 'Golden Morning Brew', price: 18.0, description: 'Bright floral single-origin roast for daily brewing.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Monsoon Malabar Blend', price: 19.5, description: 'Earthy Indian blend with low acidity and heavy body.', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=900&q=80' },
    { name: 'Coastal House Blend', price: 17.5, description: 'Balanced medium roast ideal for drip and French press.', imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Dark Cocoa Roast', price: 20.0, description: 'Deep chocolate profile with smoky undertones.', imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80' },
    { name: 'Weekend Brunch Blend', price: 16.99, description: 'Smooth and mellow crowd favorite for long mornings.', imageUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Ethiopia Yirgacheffe', price: 21.5, description: 'Jasmine and citrus washed lot for filter brewing.', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80' },
    { name: 'Colombia Huila Reserve', price: 20.75, description: 'Caramel sweetness with red apple acidity.', imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kenya AA Lot', price: 23.0, description: 'Blackcurrant brightness and syrupy body.', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=900&q=80' },
    { name: 'Decaf Swiss Water', price: 18.5, description: 'Chemical-free decaf that keeps chocolate notes.', imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Espresso Lab Blend', price: 19.25, description: 'Cafe dial-in blend for milk drinks and straight shots.', imageUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=900&q=80' }
  ],
  'Coffee Machines': [
    { name: 'AeroPress Coffee Maker', price: 89.99, description: 'Compact brewer for smooth coffee at home.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'SteamPro Espresso Machine', price: 349.0, description: 'Semi-automatic machine with integrated pressure gauge.', imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80' },
    { name: 'BeanMaster Grinder Combo', price: 279.5, description: 'All-in-one brewer and burr grinder combo.', imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' },
    { name: 'K15 Compact Brewer', price: 129.99, description: 'Single-serve compact machine for fast brewing.', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80' },
    { name: 'Classic French Press Set', price: 69.0, description: 'Thermal press setup for robust and full-bodied cups.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Manual Lever Mini', price: 429.0, description: 'Compact spring lever for craft espresso at home.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Smart Drip Brewer', price: 159.0, description: 'App-assisted drip with bloom and pulse profiles.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Travel Immersion Press', price: 42.0, description: 'Packable immersion press for trips and desks.', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80' },
    { name: 'Office Pod Machine', price: 189.0, description: 'Quiet capsule machine for shared cafe corners.', imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80' },
    { name: 'Moka Pot Induction', price: 38.5, description: 'Induction-ready aluminum moka for stovetop espresso.', imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' }
  ],
  'Barista Tools': [
    { name: 'Barista Tool Kit', price: 49.99, description: 'Essential accessories for espresso and milk prep.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
    { name: 'Latte Art Pen Set', price: 19.99, description: 'Creative pen set for latte art details.', imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80' },
    { name: 'Scale and Timer Duo', price: 42.0, description: 'Precision scale with brew timer for repeatable recipes.', imageUrl: 'https://images.unsplash.com/photo-1521302080391-cb77d1d9159a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cleaning Brush Pack', price: 14.99, description: 'Multi-size brushes for machine and grinder upkeep.', imageUrl: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Shot Glass Duo', price: 16.5, description: 'Dual espresso measuring glasses with markings.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Milk Thermometer', price: 11.5, description: 'Clip-on thermometer for latte milk windows.', imageUrl: 'https://images.unsplash.com/photo-1521302080391-cb77d1d9159a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bar Cloth Twin Pack', price: 9.99, description: 'Absorbent microfiber cloths for steam wand wipe-downs.', imageUrl: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Blind Filter Basket', price: 8.5, description: 'Backflush basket for espresso machine cleaning.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cupping Spoon Set', price: 21.0, description: 'Two deep cupping spoons for tasting flights.', imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80' },
    { name: 'Grind Catch Mat', price: 15.0, description: 'Silicone mat that catches grinder mess.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' }
  ],
  'Cold Brew': [
    { name: 'Classic Cold Brew Bottle', price: 22.0, description: 'Easy steep bottle for smooth overnight brew.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Nitro Chill Concentrate', price: 15.99, description: 'Rich cold brew concentrate for milk-based drinks.', imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80' },
    { name: 'Citrus Cold Brew Blend', price: 17.25, description: 'Bright blend tuned for cold extraction.', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cold Brew Filter Pack', price: 11.5, description: 'Disposable filters for clean and quick prep.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Iced Coffee Starter Kit', price: 34.0, description: 'Starter bundle for cafe-style iced coffee at home.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Toddy-Style Brewer', price: 48.0, description: 'Large batch cold brew system for home fridges.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Vanilla Cold Foam Kit', price: 19.5, description: 'Whipper-friendly syrup and recipe card for cold foam.', imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80' },
    { name: 'Ready-to-Drink Can 4-Pack', price: 14.0, description: 'Nitro-style cold brew cans for on-the-go.', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Ice Cube Tray Sphere', price: 12.0, description: 'Slow-melt spheres that keep iced drinks cold.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Oat Milk Cold Brew Bundle', price: 28.0, description: 'Concentrate plus barista oat milk pairing.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' }
  ],
  'Pour Over': [
    { name: 'Ceramic V60 Dripper', price: 27.0, description: 'Classic dripper for bright and nuanced brews.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' },
    { name: 'Gooseneck Kettle', price: 58.99, description: 'Precision pour control for pour-over recipes.', imageUrl: 'https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=900&q=80' },
    { name: 'Paper Filter Bundle', price: 13.5, description: 'Bleached and unbleached filters for clean cups.', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=900&q=80' },
    { name: 'Server Carafe 600ml', price: 26.75, description: 'Heat-resistant carafe for serving fresh brews.', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Pour Over Stand', price: 44.0, description: 'Minimal stand to stabilize dripper and mug.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' }
  ],
  'Tea & Infusions': [
    { name: 'Masala Chai Blend', price: 12.99, description: 'Spiced tea blend with cardamom and ginger notes.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Earl Grey Supreme', price: 13.5, description: 'Bergamot-forward black tea for elegant cups.', imageUrl: 'https://images.unsplash.com/photo-1594631661960-348f8f0fbe89?auto=format&fit=crop&w=900&q=80' },
    { name: 'Chamomile Calm', price: 11.0, description: 'Floral chamomile infusion for evening wind-down.', imageUrl: 'https://images.unsplash.com/photo-1507915135761-41a0a222c709?auto=format&fit=crop&w=900&q=80' },
    { name: 'Hibiscus Cooler', price: 10.75, description: 'Tart hibiscus infusion, great hot or iced.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
    { name: 'Green Tea Reserve', price: 14.25, description: 'Light and grassy premium green tea leaves.', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80' }
  ],
  'Bakery & Snacks': [
    { name: 'Butter Croissant', price: 3.99, description: 'Flaky all-butter croissant baked fresh daily.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Almond Biscotti', price: 4.5, description: 'Crunchy almond biscotti perfect for dipping.', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80' },
    { name: 'Chocolate Muffin', price: 4.75, description: 'Moist muffin with deep cocoa flavor.', imageUrl: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Granola Cookie Pack', price: 5.25, description: 'Oat and seed cookies with light honey sweetness.', imageUrl: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cafe Sandwich Box', price: 8.99, description: 'Fresh vegetable sandwich box for quick lunches.', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80' }
  ],
  'Gift Boxes': [
    { name: 'Starter Gift Box', price: 39.99, description: 'Intro box with beans, mug, and brew guide.', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Premium Roast Bundle', price: 64.0, description: 'Three premium roasts and tasting notes booklet.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Barista Essentials Box', price: 79.99, description: 'Tools and accessories for aspiring home baristas.', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80' },
    { name: 'Festival Hamper', price: 89.5, description: 'Seasonal hamper with coffee, tea, and snacks.', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
    { name: 'Corporate Gift Pack', price: 119.0, description: 'Premium gifting set curated for teams and clients.', imageUrl: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=900&q=80' }
  ],
  'Coffee Capsules': [
    { name: 'Classic Espresso Pods', price: 15.99, description: 'Smooth and balanced espresso capsules for daily use.', imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80' },
    { name: 'Intenso Dark Pods', price: 17.5, description: 'Dark roast capsules with rich body and cocoa notes.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' },
    { name: 'Caramel Blend Pods', price: 16.75, description: 'Flavored capsule blend with caramel sweetness.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Breakfast Blend Pods', price: 14.99, description: 'Light roast capsules ideal for morning cups.', imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Decaf Smooth Pods', price: 16.25, description: 'Decaffeinated capsules with full coffee flavor.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' }
  ],
  'Merchandise': [
    { name: 'Bean & Bloom Ceramic Mug', price: 18.0, description: 'Signature ceramic mug with matte finish.', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Travel Tumbler 450ml', price: 24.99, description: 'Insulated tumbler to keep coffee hot for hours.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Canvas Tote Bag', price: 14.5, description: 'Reusable tote bag with coffee-themed print.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Coffee Journal', price: 12.99, description: 'Tasting notes journal for brewing experiments.', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Sticker Pack', price: 6.5, description: 'Set of waterproof coffee-themed stickers.', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' },
    { name: 'Barista Apron', price: 32.0, description: 'Waxed canvas apron with tool pocket.', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' },
    { name: 'Enamel Camp Mug', price: 16.5, description: 'Speckled enamel mug for patio mornings.', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Brew Cap Soft', price: 19.0, description: 'Soft cotton cap with embroidered bean mark.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Desk Mat Brew', price: 22.0, description: 'Cork desk mat sized for kettle and dripper.', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Gift Card Sleeve', price: 9.0, description: 'Physical gift card in reusable kraft sleeve.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' }
  ],
  'Accessories': [
    { name: 'Bean Storage Canister', price: 27.0, description: 'Airtight canister with CO2 valve for fresh beans.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Coffee Scoop Set', price: 9.5, description: 'Two stainless scoops with long handles.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'Reusable Straw Pack', price: 8.0, description: 'Steel straws for iced lattes and cold brew.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Drip Tray Mat', price: 11.0, description: 'Absorbent mat for espresso drip trays.', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Label Maker Kit', price: 14.5, description: 'Write-on labels for roast dates and grind settings.', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Counter Organizer Tray', price: 21.0, description: 'Bamboo tray for syrups, spoons, and filters.', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80' },
    { name: 'Brew Timer Cube', price: 13.0, description: 'Flip cube timer for bloom and steep stages.', imageUrl: 'https://images.unsplash.com/photo-1521302080391-cb77d1d9159a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Syrup Sampler Trio', price: 17.5, description: 'Vanilla, caramel, and hazelnut cafe syrups.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Milk Jug Thermometer Clip', price: 7.5, description: 'Clip that holds your milk thermometer upright.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Filter Paper Organizer', price: 12.25, description: 'Wall-friendly holder for V60 and Chemex papers.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' }
  ],
  'Ready to Drink': [
    { name: 'Sparkling Espresso Can', price: 4.25, description: 'Lightly sparkling espresso tonic style can.', imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80' },
    { name: 'Oat Latte Bottle', price: 5.5, description: 'Chilled oat latte ready from the fridge.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Mocha Frappe Cup', price: 6.25, description: 'Blended mocha cup for afternoon pick-me-ups.', imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=80' },
    { name: 'Black Cold Brew Pint', price: 5.0, description: 'Unsweetened cold brew pint for sharing.', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Matcha Oat Cooler', price: 5.75, description: 'Ceremonial-grade matcha with oat milk.', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80' },
    { name: 'Chai Concentrate Bottle', price: 7.5, description: 'Spiced chai concentrate for home lattes.', imageUrl: 'https://images.unsplash.com/photo-1594631661960-348f8f0fbe89?auto=format&fit=crop&w=900&q=80' },
    { name: 'Protein Coffee Shake', price: 6.9, description: 'Coffee protein shake for post-workout mornings.', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80' },
    { name: 'Seasonal Special Can', price: 4.75, description: 'Rotating seasonal flavor — ask barista for this week.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kids Cocoa Cup', price: 3.5, description: 'Warm cocoa for cafe visits with little ones.', imageUrl: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Iced Americano Bottle', price: 4.5, description: 'Long black style iced americano to go.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' }
  ]
};

function toSlug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const defaultProducts = Object.entries(seedCatalog).flatMap(([category, items]) => {
  return items.map((item, index) => ({
    id: `seed-${toSlug(category)}-${index + 1}`,
    name: item.name,
    price: item.price,
    category,
    description: item.description,
    featured: index < 2,
    imageUrl: item.imageUrl
  }));
});

const categoryFallbackImages = {
  'Espresso': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
  'Espresso Gear': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80',
  'Beans & Blends': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'Coffee Machines': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
  'Barista Tools': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80',
  'Cold Brew': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
  'Pour Over': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
  'Tea & Infusions': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'Bakery & Snacks': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'Gift Boxes': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'Coffee Capsules': 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
  'Merchandise': 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  'Ready to Drink': 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80'
};

function mergeSeedProducts(existingProducts) {
  const list = Array.isArray(existingProducts) ? existingProducts : [];
  const existingIds = new Set(list.map((item) => String(item.id || '')));
  const missing = defaultProducts.filter((item) => !existingIds.has(item.id));
  return missing.length ? [...list, ...missing] : list;
}

function parseImageUrlsInput(value) {
  return String(value || '')
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));
}

function buildDefaultLongDescription(product) {
  const name = String(product?.name || 'This product').trim();
  const category = String(product?.category || 'coffee collection').trim();
  const shortDescription = String(product?.description || 'Crafted for everyday enjoyment.').trim();
  return `${name} is part of our ${category} range, selected for customers who want reliable quality, thoughtful design, and a polished coffee experience at home. ${shortDescription} Expect balanced performance, premium presentation, and a product that fits effortlessly into your daily routine, whether you are upgrading your morning setup or gifting something refined to another coffee lover.`;
}

function normalizeProduct(product) {
  const primaryImage = String(product?.imageUrl || '').trim();
  const imageUrls = Array.isArray(product?.imageUrls)
    ? product.imageUrls.map((item) => String(item || '').trim()).filter((item) => /^https?:\/\//i.test(item))
    : [];
  const mergedImages = Array.from(new Set([
    ...imageUrls,
    ...(primaryImage && /^https?:\/\//i.test(primaryImage) ? [primaryImage] : [])
  ]));
  const finalPrimary = mergedImages[0] || DEFAULT_IMAGE_URL;

  return {
    ...product,
    imageUrl: finalPrimary,
    imageUrls: mergedImages.length ? mergedImages : [DEFAULT_IMAGE_URL],
    longDescription: String(product?.longDescription || '').trim() || buildDefaultLongDescription(product),
    stock: Number.isFinite(Number(product?.stock)) ? Math.max(0, Number(product.stock)) : 25
  };
}

function normalizeProductList(products) {
  return (Array.isArray(products) ? products : []).map(normalizeProduct);
}

function optimizeImageUrl(url, width = 640, quality = 72) {
  const value = String(url || '').trim();
  if (!value) return value;
  if (!/images\.unsplash\.com/i.test(value)) return value;
  try {
    const parsed = new URL(value);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', String(quality));
    return parsed.toString();
  } catch {
    return value;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function formatCurrencyAmount(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
}

function formatCurrency(value) {
  if (typeof value === 'number') return formatCurrencyAmount(value);
  const text = String(value ?? '').trim();
  const numeric = text.replace(/[^\d.-]/g, '');
  if (numeric && !Number.isNaN(Number(numeric))) {
    return formatCurrencyAmount(Number(numeric));
  }
  return text.replace(/\$/g, 'Rs ').replace(/USD/gi, 'INR');
}

const CART_KEY = 'bean-bloom-cart'; // per-user key prefix: bean-bloom-cart-{userId}
const API_BASE = 'http://localhost:3001/api';
const REVIEW_REQUEST_TIMEOUT = 1200;

async function loadProductReviews(productId) {
  if (!productId) return [];
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), REVIEW_REQUEST_TIMEOUT) : null;
  try {
    const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(productId)}`, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) throw new Error('Unable to load reviews right now.');
    const reviews = await response.json();
    return Array.isArray(reviews) ? reviews.map((item) => ({
      id: item.id,
      userId: item.user_id,
      name: item.user_name,
      rating: Number(item.rating || 0),
      comment: item.comment,
      createdAt: item.created_at
    })) : [];
  } catch {
    return [];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function saveProductReview(productId, review) {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      userId: review.userId,
      userName: review.name,
      rating: review.rating,
      comment: review.comment
    })
  });

  if (!response.ok) {
    let errorMessage = 'Unable to save review right now.';
    try {
      const data = await response.json();
      errorMessage = data.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

function renderRatingStars(value) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const full = '&#9733;'.repeat(rating);
  const empty = '&#9734;'.repeat(5 - rating);
  return `${full}${empty}`;
}

function getLoggedInUser() {
  try {
    const raw = sessionStorage.getItem(USER_SESSION_KEY) || localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getUserCartKey() {
  const user = getLoggedInUser();
  return user ? `${CART_KEY}-${user.id}` : null;
}

function loadCart() {
  const key = getUserCartKey();
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function saveCart(cart) {
  const key = getUserCartKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart));
}

function getCartCount() {
  return loadCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  el.textContent = getCartCount();
}

// Try to persist cart item to SQL backend; silently fails if server is offline
async function syncCartToSQL(userId, productId, quantity, action = 'add') {
  try {
    if (action === 'add') {
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: productId, quantity })
      });
    } else if (action === 'update') {
      await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
    } else if (action === 'remove') {
      await fetch(`${API_BASE}/cart/${userId}/${productId}`, { method: 'DELETE' });
    } else if (action === 'clear') {
      await fetch(`${API_BASE}/cart/${userId}`, { method: 'DELETE' });
    }
  } catch { /* server offline, localStorage is source of truth */ }
}

function showLoginPrompt() {
  // Remove any existing modal
  document.getElementById('login-prompt-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'login-prompt-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:28px;padding:2.4rem 2.2rem;width:min(420px,90vw);box-shadow:0 40px 100px rgba(0,0,0,.22);text-align:center;">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(138,75,47,.12);display:grid;place-items:center;margin:0 auto 1.2rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8c6138" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h3 style="margin:0 0 .6rem;font-size:1.3rem;">Sign in to add to cart</h3>
      <p style="color:#6f6b7b;margin:0 0 1.6rem;font-size:.95rem;">Create a free account or sign in to save items and track your orders.</p>
      <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;">
        <a href="login.html" class="btn" style="min-width:120px;">Sign in</a>
        <a href="register.html" class="btn secondary" style="min-width:120px;">Create account</a>
      </div>
      <button id="close-login-modal" style="margin-top:1.2rem;background:none;border:none;color:#6f6b7b;font:inherit;font-size:.88rem;cursor:pointer;">Continue browsing</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('close-login-modal')?.addEventListener('click', () => modal.remove());
}

function addToCart(productId, quantity = 1) {
  const user = getLoggedInUser();
  if (!user) {
    showLoginPrompt();
    return false;
  }

  const products = loadProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) return false;

  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + quantity;
  } else {
    cart.push({ id: product.id, name: product.name, price: Number(product.price), category: product.category, quantity, imageUrl: product.imageUrl });
  }
  saveCart(cart);
  updateCartCount();
  syncCartToSQL(user.id, productId, quantity, 'add');
  if (window.refreshAdminMetrics) window.refreshAdminMetrics();
  return true;
}

function removeFromCart(productId) {
  const user = getLoggedInUser();
  const key = getUserCartKey();
  if (!key) return;
  const cart = loadCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  if (user) syncCartToSQL(user.id, productId, 0, 'remove');
}

function updateCartQuantity(productId, quantity) {
  const user = getLoggedInUser();
  const cart = loadCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity = quantity;
  saveCart(cart);
  updateCartCount();
  if (user) syncCartToSQL(user.id, productId, quantity, 'update');
}

function clearCart() {
  const user = getLoggedInUser();
  const key = getUserCartKey();
  if (key) localStorage.removeItem(key);
  updateCartCount();
  if (user) syncCartToSQL(user.id, null, 0, 'clear');
}

// ---- Orders ----
function getUserOrdersKey() {
  const user = getLoggedInUser();
  return user ? `${ORDERS_KEY}-${user.id}` : null;
}

function loadOrders() {
  const key = getUserOrdersKey();
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function saveOrder(order) {
  const key = getUserOrdersKey();
  if (!key) return null;
  const orders = loadOrders();
  orders.unshift(order); // newest first
  localStorage.setItem(key, JSON.stringify(orders));
  return order;
}

// ---- Addresses ----
function getUserAddressKey() {
  const user = getLoggedInUser();
  return user ? `${ADDRESS_KEY}-${user.id}` : null;
}

function loadSavedAddress() {
  const key = getUserAddressKey();
  if (!key) return null;
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

function saveAddress(address) {
  const key = getUserAddressKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(address));
}

function getCategoryFilter() {
  return new URLSearchParams(window.location.search).get('category')?.trim().toLowerCase() || '';
}

function formatCategoryTitle(slug) {
  const labels = {
    machines: 'Coffee Machines',
    espresso: 'Espresso Gear',
    beans: 'Beans & Blends',
    tools: 'Barista Tools'
  };
  if (labels[slug]) return labels[slug];
  if (!slug) return 'Products';
  return String(slug)
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapCategoryFilter(filter) {
  const categoryMap = {
    machines: ['coffee machines'],
    espresso: ['espresso gear'],
    beans: ['beans & blends', 'beans'],
    tools: ['barista tools', 'tools', 'accessories', 'gear']
  };
  return categoryMap[filter] || [filter];
}

function matchesCategory(productCategory, filter) {
  if (!filter) return true;
  const normalized = String(productCategory || '').toLowerCase();
  const terms = mapCategoryFilter(filter);
  return terms.some(term => normalized.includes(term));
}

function loadProducts() {
  if (productsCache) return productsCache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = mergeSeedProducts(parsed);
      const normalized = normalizeProductList(merged);
      if (normalized.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      productsCache = normalized;
      return productsCache;
    }
  } catch (e) {
    console.warn('Unable to load products', e);
  }
  const normalizedDefaults = normalizeProductList(defaultProducts);
  productsCache = normalizedDefaults;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedDefaults));
  return productsCache;
}

function saveProducts(products) {
  productsCache = normalizeProductList(products);
  categoriesCache = null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productsCache));
}

function loadCategories() {
  if (categoriesCache) return categoriesCache;
  const products = loadProducts();
  const fromProducts = Array.from(new Set(products.map((product) => (product.category || '').trim()).filter(Boolean)));
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = Array.from(new Set([...(Array.isArray(parsed) ? parsed : []), ...defaultCategories, ...fromProducts]));
      if (merged.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(merged));
      }
      categoriesCache = merged;
      return categoriesCache;
    }
  } catch (e) {
    console.warn('Unable to load categories', e);
  }
  const categories = Array.from(new Set([...defaultCategories, ...fromProducts]));
  categoriesCache = categories;
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  return categoriesCache;
}

function saveCategories(categories) {
  categoriesCache = Array.isArray(categories) ? categories : [];
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categoriesCache));
}

function normalizeCategory(name) {
  return String(name || '').trim();
}

function ensureCategory(name) {
  const normalized = normalizeCategory(name);
  if (!normalized) return;
  const categories = loadCategories();
  if (!categories.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
    categories.unshift(normalized);
    saveCategories(categories);
  }
}

function renderCategoryOptions(selected) {
  const categorySelect = document.getElementById('category-select');
  if (!categorySelect) return;
  const categories = loadCategories();
  categorySelect.innerHTML = '<option value="">Select category</option>' + categories.map((category) => {
    return `<option value="${escapeHtml(category)}"${selected === category ? ' selected' : ''}>${escapeHtml(category)}</option>`;
  }).join('');
}

function renderCartFromAPI(cartData) {
  const cartItemsRoot = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  if (!cartItemsRoot || !cartSummary) return;

  const cart = cartData.items || [];
  cartItemsRoot.innerHTML = '';

  if (!cart.length) {
    cartItemsRoot.innerHTML = '<div class="card"><p class="muted">Your cart is empty. Add products from the shop.</p></div>';
    cartSummary.innerHTML = '';
    return;
  }

  const fragment = document.createDocumentFragment();
  cart.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <img class="product-image" src="${escapeHtml(item.image_url || DEFAULT_IMAGE_URL)}" alt="${escapeHtml(item.name)}">
      <div class="cart-item-details">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${escapeHtml(item.category_name || 'Coffee')}</p>
        <div class="cart-item-meta">
          <span>Bean & Bloom cafe & shop</span>
          <span>Pickup or delivery</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button type="button" data-decrease="${item.product_id}">−</button>
            <input type="number" min="1" value="${Number(item.quantity)}" data-quantity="${item.product_id}">
            <button type="button" data-increase="${item.product_id}">+</button>
          </div>
          <button class="btn secondary" type="button" data-remove="${item.product_id}">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">
        <strong>${formatCurrencyAmount(Number(item.price) * Number(item.quantity))}</strong>
      </div>
    `;
    fragment.appendChild(row);
  });

  cartItemsRoot.appendChild(fragment);

  // ✨ Using totalValue from database; discounts from admin portal
  const apiItems = (cartData.items || []).map((item) => ({
    id: item.product_id,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    category: item.category_name || ''
  }));
  const pricing = calculateCartPricing(apiItems);
  const totalItems = cartData.itemCount;

  cartSummary.innerHTML = `
    <div class="cart-summary-box">
      <h3>Price details</h3>
      <div class="summary-row"><span>Price (${totalItems} items)</span><span>${formatCurrencyAmount(pricing.subtotal)}</span></div>
      <div class="summary-row"><span>Discounts</span><span>− ${formatCurrencyAmount(pricing.discountTotal)}</span></div>
      <div class="summary-total"><span>Total amount</span><span>${formatCurrencyAmount(pricing.total)}</span></div>
      <button class="btn place-order" id="checkout-button" type="button">Place order</button>
      <button class="btn secondary" id="clear-cart" type="button">Clear cart</button>
      <p class="summary-note">${pricing.discountTotal > 0 ? `You save ${formatCurrencyAmount(pricing.discountTotal)} with active cafe discounts.` : 'Add discounts in Admin → Discounts to offer savings at checkout.'}</p>
      <p class="summary-subnote">Pay with Razorpay · Cafe pickup available · Fresh bakery same-day locally.</p>
    </div>
  `;

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-remove');
      try {
        await BeanbBloomAPI.Cart.remove(productId);
        const updatedCart = await BeanbBloomAPI.Cart.getCartValue();
        renderCartFromAPI(updatedCart);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    });
  });

  document.querySelectorAll('[data-increase]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-increase');
      const item = cart.find((entry) => entry.product_id === productId);
      if (item) {
        try {
          await BeanbBloomAPI.Cart.update(productId, Number(item.quantity || 1) + 1);
          const updatedCart = await BeanbBloomAPI.Cart.getCartValue();
          renderCartFromAPI(updatedCart);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    });
  });

  document.querySelectorAll('[data-decrease]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-decrease');
      const item = cart.find((entry) => entry.product_id === productId);
      if (item && Number(item.quantity || 1) > 1) {
        try {
          await BeanbBloomAPI.Cart.update(productId, Number(item.quantity || 1) - 1);
          const updatedCart = await BeanbBloomAPI.Cart.getCartValue();
          renderCartFromAPI(updatedCart);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    });
  });

  document.querySelectorAll('[data-quantity]').forEach((input) => {
    input.addEventListener('change', async (event) => {
      const productId = event.target.getAttribute('data-quantity');
      const value = Number(event.target.value);
      if (value >= 1) {
        try {
          await BeanbBloomAPI.Cart.update(productId, value);
          const updatedCart = await BeanbBloomAPI.Cart.getCartValue();
          renderCartFromAPI(updatedCart);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    });
  });

  const clearButton = document.getElementById('clear-cart');
  if (clearButton) {
    clearButton.addEventListener('click', async () => {
      try {
        await BeanbBloomAPI.Cart.clear();
        renderCartFromAPI({ items: [], totalValue: 0, itemCount: 0 });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    });
  }

  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
}

function renderCart() {
  const cartItemsRoot = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  if (!cartItemsRoot || !cartSummary) return;

  const cart = loadCart();
  cartItemsRoot.innerHTML = '';

  if (!cart.length) {
    cartItemsRoot.innerHTML = '<div class="card"><p class="muted">Your cart is empty. Add products from the shop.</p></div>';
    cartSummary.innerHTML = '';
    return;
  }

  const fragment = document.createDocumentFragment();
  cart.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <img class="product-image" src="${escapeHtml(optimizeImageUrl(item.imageUrl || DEFAULT_IMAGE_URL, 260, 72))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">
      <div class="cart-item-details">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${escapeHtml(item.category || 'Coffee')}</p>
        <div class="cart-item-meta">
          <span>Bean & Bloom cafe & shop</span>
          <span>Pickup or delivery</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button type="button" data-decrease="${item.id}">−</button>
            <input type="number" min="1" value="${Number(item.quantity)}" data-quantity="${item.id}">
            <button type="button" data-increase="${item.id}">+</button>
          </div>
          <button class="btn secondary" type="button" data-remove="${item.id}">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">
        <strong>${formatCurrencyAmount(Number(item.price) * Number(item.quantity))}</strong>
      </div>
    `;
    fragment.appendChild(row);
  });

  cartItemsRoot.appendChild(fragment);

  const pricing = calculateCartPricing(cart);
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  cartSummary.innerHTML = `
    <div class="cart-summary-box">
      <h3>Price details</h3>
      <div class="summary-row"><span>Price (${totalItems} items)</span><span>${formatCurrencyAmount(pricing.subtotal)}</span></div>
      <div class="summary-row"><span>Discounts</span><span>− ${formatCurrencyAmount(pricing.discountTotal)}</span></div>
      <div class="summary-total"><span>Total amount</span><span>${formatCurrencyAmount(pricing.total)}</span></div>
      <button class="btn place-order" id="checkout-button" type="button">Place order</button>
      <button class="btn secondary" id="clear-cart" type="button">Clear cart</button>
      <p class="summary-note">${pricing.discountTotal > 0 ? `You save ${formatCurrencyAmount(pricing.discountTotal)} with active cafe discounts.` : 'Add discounts in Admin → Discounts to offer savings at checkout.'}</p>
      <p class="summary-subnote">Pay with Razorpay · Cafe pickup available · Fresh bakery same-day locally.</p>
    </div>
  `;

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-remove');
      removeFromCart(productId);
      renderCart();
    });
  });

  document.querySelectorAll('[data-increase]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-increase');
      const cart = loadCart();
      const item = cart.find((entry) => entry.id === productId);
      if (item) {
        updateCartQuantity(productId, Number(item.quantity || 1) + 1);
        renderCart();
      }
    });
  });

  document.querySelectorAll('[data-decrease]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-decrease');
      const cart = loadCart();
      const item = cart.find((entry) => entry.id === productId);
      if (item && Number(item.quantity || 1) > 1) {
        updateCartQuantity(productId, Number(item.quantity || 1) - 1);
        renderCart();
      }
    });
  });

  document.querySelectorAll('[data-quantity]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const productId = event.target.getAttribute('data-quantity');
      const value = Number(event.target.value);
      if (value >= 1) {
        updateCartQuantity(productId, value);
        renderCart();
      }
    });
  });

  const clearButton = document.getElementById('clear-cart');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      clearCart();
      renderCart();
    });
  }

  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
}

function renderPublicCategoryGrid() {
  const root = document.getElementById('public-category-grid');
  if (!root) return;
  
  const categories = loadCategories();
  const products = loadProducts();
  root.innerHTML = '';
  
  const categoryImages = JSON.parse(localStorage.getItem('bean-bloom-category-images') || '{}');

  categories.forEach(category => {
    const categoryIndex = root.children.length;
    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-card';
    categoryLink.href = `category.html?category=${encodeURIComponent(category.toLowerCase())}`;
    categoryLink.dataset.category = category.toLowerCase();
    
    const customImage = categoryImages[category];
    const categoryProduct = products.find((item) => String(item.category || '').toLowerCase() === category.toLowerCase() && item.imageUrl);
    const mappedFallback = categoryFallbackImages[category];
    const defaultImage = mappedFallback || 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80';
    const hasValidCustomImage = /^https?:\/\//i.test(String(customImage || '').trim());
    const hasValidProductImage = /^https?:\/\//i.test(String(categoryProduct?.imageUrl || '').trim());
    const preferredUrl = hasValidCustomImage
      ? String(customImage).trim()
      : (hasValidProductImage ? String(categoryProduct.imageUrl).trim() : defaultImage);
    const optimizedImage = escapeHtml(optimizeImageUrl(preferredUrl || defaultImage, 640, 68));
    const isAboveFold = categoryIndex < 4;

    categoryLink.innerHTML = `
      <img class="category-card-media" src="${optimizedImage}" alt="${escapeHtml(category)}" ${isAboveFold ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">
      <div class="category-card-overlay"></div>
      <h3>${escapeHtml(category)}</h3>
    `;
    root.appendChild(categoryLink);
  });
}


function renderRecentlyViewedRail() {
  const root = document.getElementById('recently-viewed-rail');
  if (!root) return;
  const section = document.getElementById('recently-viewed-section') || root.closest('section');
  const products = loadRecentlyViewed()
    .map((id) => loadProducts().find((p) => String(p.id) === id))
    .filter(Boolean)
    .slice(0, 8);
  if (!products.length) {
    root.innerHTML = '';
    if (section) section.hidden = true;
    return;
  }
  if (section) {
    section.hidden = false;
    section.classList.add('is-visible');
  }
  root.classList.add('grid', 'product-grid', 'product-grid-dense');
  root.innerHTML = products.map((product) => renderProductCardHtml(product)).join('');
  bindProductCardActions(root);
}

function renderFeaturedProducts() {
  const root = document.getElementById('featured-products');
  if (!root) return;
  let products = loadProducts().filter((p) => p.featured).slice(0, 8);
  if (!products.length) {
    products = loadProducts().slice(0, 8);
  }
  if (!products.length) {
    root.innerHTML = '<div class="card"><p class="muted">No featured products yet. Mark items as featured in admin.</p></div>';
    return;
  }
  root.innerHTML = products.map((product) => renderProductCardHtml(product)).join('');
  bindProductCardActions(root);
  const section = root.closest('section');
  if (section) {
    section.hidden = false;
    section.classList.add('is-visible');
  }
}

function renderTrendingRail() {
  // Kept for compatibility — featured grid replaced the old horizontal rail.
  renderFeaturedProducts();
}

function renderOfferStrip() {
  const root = document.getElementById('offer-strip');
  if (!root) return;
  const discounts = getActiveDiscounts().slice(0, 4);
  const offers = discounts.length ? discounts.map((d) => ({
    title: d.name,
    desc: d.type === 'store' ? 'Store-wide' : d.type === 'category' ? `On ${d.category}` : 'Selected product',
    value: d.valueType === 'fixed' ? formatCurrencyAmount(d.value) : `${d.value}% off`
  })) : [
    { title: 'Cafe pickup', desc: 'Order online, collect at the bar', value: 'Free' },
    { title: 'Fresh roast', desc: 'Small-batch beans each week', value: 'New' },
    { title: 'Bank offer', desc: 'Extra savings on Razorpay UPI', value: 'UPI' },
    { title: 'Gift ready', desc: 'Hamper wraps available in-store', value: 'Gift' }
  ];
  root.innerHTML = offers.map((o) => `
    <article class="offer-chip">
      <strong>${escapeHtml(o.value)}</strong>
      <div><span>${escapeHtml(o.title)}</span><small>${escapeHtml(o.desc)}</small></div>
    </article>`).join('');
}

function renderProductCardHtml(product, options = {}) {
  const wished = loadWishlist().includes(String(product.id));
  const compared = loadCompareList().includes(String(product.id));
  const stock = Number(product.stock);
  const imageSrc = escapeHtml(optimizeImageUrl(product.imageUrl || DEFAULT_IMAGE_URL, 520, 70));
  const name = escapeHtml(product.name || 'Product');
  const description = escapeHtml(product.description || 'Freshly made with care.');
  const category = escapeHtml(product.category || 'Coffee');
  return `
    <article class="product-card${options.compact ? ' product-card-compact' : ''}" data-product-id="${escapeHtml(product.id)}">
      <button class="wishlist-btn${wished ? ' is-active' : ''}" type="button" data-wishlist="${escapeHtml(product.id)}" aria-label="Wishlist">${wished ? '♥' : '♡'}</button>
      <img class="product-image" src="${imageSrc}" alt="${name}" loading="lazy" decoding="async">
      <span class="badge">${category}</span>
      ${stock <= 5 ? `<span class="stock-pill">${stock <= 0 ? 'Sold out' : 'Only few left'}</span>` : ''}
      <h3>${name}</h3>
      <p class="muted">${description}</p>
      <div class="product-meta">
        <div>
          <div class="price">${formatCurrencyAmount(Number(product.price))}</div>
          <label class="compare-check"><input type="checkbox" data-compare="${escapeHtml(product.id)}" ${compared ? 'checked' : ''}> Compare</label>
        </div>
        <div class="product-actions">
          <button class="btn secondary add-to-kart" type="button" data-buy="${escapeHtml(product.id)}" ${stock <= 0 ? 'disabled' : ''}>Add to cart</button>
        </div>
      </div>
    </article>`;
}
function bindProductCardActions(root = document) {
  root.querySelectorAll('[data-buy]').forEach((btn) => {
    if (btn.dataset.bound) return; btn.dataset.bound = 'true';
    btn.addEventListener('click', (event) => { event.stopPropagation(); const id = btn.getAttribute('data-buy'); const product = loadProducts().find((p) => p.id === id); const added = addToCart(id); if (added) showToast(`${product?.name || 'Item'} added to cart.`, 'success'); });
  });
  root.querySelectorAll('[data-wishlist]').forEach((btn) => {
    if (btn.dataset.bound) return; btn.dataset.bound = 'true';
    btn.addEventListener('click', (event) => { event.stopPropagation(); const on = toggleWishlist(btn.getAttribute('data-wishlist')); btn.classList.toggle('is-active', on); btn.textContent = on ? '♥' : '♡'; showToast(on ? 'Saved to wishlist.' : 'Removed from wishlist.', 'success'); });
  });
  root.querySelectorAll('[data-compare]').forEach((input) => {
    if (input.dataset.bound) return; input.dataset.bound = 'true';
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('change', () => { const id = input.getAttribute('data-compare'); const list = toggleCompare(id); input.checked = list.includes(id); });
  });
  root.querySelectorAll('.product-card').forEach((card) => {
    if (card.dataset.navBound) return; card.dataset.navBound = 'true';
    card.addEventListener('click', (event) => { if (event.target.closest('button, input, label, a')) return; const id = card.getAttribute('data-product-id'); if (id) window.location.href = `product.html?id=${encodeURIComponent(id)}`; });
  });
}

function renderPublicProducts(options = {}) {
  const root = document.getElementById('public-products');
  if (!root) return;
  const showAll = options.showAll || root.dataset.showAll === 'true' || false;
  let products = loadProducts();
  if (!showAll) products = products.filter(p => p.featured !== false);
  const categoryFilter = options.categoryFilter || getCategoryFilter();
  const categoryChip = options.categoryChip || '';
  const searchQuery = String(options.searchQuery ?? document.getElementById('product-search')?.value ?? '').trim().toLowerCase();
  const sortBy = options.sortBy || document.getElementById('product-sort')?.value || 'featured';
  const priceMin = Number(options.priceMin ?? document.getElementById('filter-price-min')?.value);
  const priceMax = Number(options.priceMax ?? document.getElementById('filter-price-max')?.value);
  const inStockOnly = options.inStockOnly ?? !!document.getElementById('filter-in-stock')?.checked;
  if (categoryFilter) products = products.filter((product) => matchesCategory(product.category, categoryFilter));
  if (categoryChip) products = products.filter((product) => String(product.category || '').toLowerCase() === categoryChip.toLowerCase());
  if (searchQuery) products = products.filter((product) => `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase().includes(searchQuery));
  if (Number.isFinite(priceMin) && priceMin > 0) products = products.filter((p) => Number(p.price) >= priceMin);
  if (Number.isFinite(priceMax) && priceMax > 0) products = products.filter((p) => Number(p.price) <= priceMax);
  if (inStockOnly) products = products.filter((p) => Number(p.stock) > 0);
  if (sortBy === 'price-asc') products = [...products].sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === 'price-desc') products = [...products].sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === 'name') products = [...products].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  else products = [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const meta = document.getElementById('shop-result-meta');
  if (meta) meta.textContent = searchQuery ? `Showing ${products.length} result${products.length === 1 ? '' : 's'} for “${searchQuery}”` : `${products.length} products`;
  if (!products.length) { root.innerHTML = '<div class="card"><p class="muted">No products match your filters. Try clearing search or widening the price range.</p></div>'; return; }
  root.innerHTML = products.map((product) => renderProductCardHtml(product)).join('');
  bindProductCardActions(root);
  renderCompareBar();
}

async function renderProductDetail() {
  const root = document.getElementById('product-detail');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const products = loadProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    root.innerHTML = `<div class="container"><article class="card"><h2>Product not found</h2><p class="muted">Please return to the shop and select an available product.</p><a class="btn" href="index.html">Return to shop</a></article></div>`;
    return;
  }

  pushRecentlyViewed(product.id);
  document.body.dataset.seoTitle = `${product.name} | Bean & Bloom`;
  document.body.dataset.seoDescription = product.description || `${product.name} from Bean & Bloom`;
  applySeoMeta();

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length
    ? product.imageUrls
    : [product.imageUrl || DEFAULT_IMAGE_URL];
  const currentUser = getLoggedInUser();
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wished = loadWishlist().includes(String(product.id));

  root.innerHTML = `
    <section class="section product-detail-section">
      <div class="container product-detail-grid">
        <div class="product-gallery-wrap">
          <div class="product-detail-image">
            <img id="product-main-image" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}">
          </div>
          <div class="product-thumb-row${images.length <= 1 ? ' hide' : ''}" id="product-thumb-row">
            ${images.map((src, index) => `
              <button class="product-thumb${index === 0 ? ' active' : ''}" type="button" data-product-image="${escapeHtml(src)}">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)} image ${index + 1}">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="product-detail-copy">
          <span class="eyebrow">${escapeHtml(product.category || 'Coffee')}</span>
          <h1 class="product-title">${escapeHtml(product.name)}</h1>
          <p class="muted">${escapeHtml(product.description || 'Freshly made with care.')}</p>
          <div class="product-rating-row" id="product-rating-row">
            <span class="product-review-stars product-review-stars-lg">${renderRatingStars(0)}</span>
            <span class="muted">Loading reviews...</span>
          </div>
          <div class="product-detail-meta">
            <span class="price">${formatCurrencyAmount(Number(product.price))}</span>
            <button class="btn" id="buy-button" type="button">Add to cart</button>
            <button class="btn secondary" id="wishlist-detail-btn" type="button">${wished ? '♥ Wishlisted' : '♡ Wishlist'}</button>
          </div>
          <p class="muted" style="margin:.6rem 0 0;font-size:.88rem;">${Number(product.stock) > 0 ? `${product.stock} in stock · Razorpay checkout · Cafe pickup available` : 'Currently out of stock'}</p>
          <div class="product-detail-panel">
            <h3>Product details</h3>
            <p class="product-detail-note">${escapeHtml(product.longDescription || product.description || 'Enjoy fast shipping, secure checkout, and premium customer support with every order.')}</p>
          </div>
        </div>
      </div>

      ${similar.length ? `<div class="container" style="margin-top:2rem;"><div class="section-head"><div><h2>Similar in ${escapeHtml(product.category || 'this range')}</h2><p class="muted">Customers also browse these.</p></div></div><div class="grid product-grid product-grid-dense" id="similar-products-rail">${similar.map((item) => renderProductCardHtml(item)).join('')}</div></div>` : ''}

      <div class="container product-review-section">
        <div class="product-review-header">
          <div>
            <h2>Customer reviews</h2>
            <p>Share your experience and help other buyers make informed decisions.</p>
          </div>
        </div>
        <div class="product-reviews-grid">
          <div class="product-review-list" id="product-review-list"><p class="muted">Loading reviews...</p></div>
          ${currentUser ? `
            <form class="card product-review-form" id="product-review-form">
              <h3 style="margin-top:0;">Write a review</h3>
              <label>Name
                <input id="reviewer-name" value="${escapeHtml(currentUser.name || 'Customer')}" readonly>
              </label>
              <label>Rating (1 to 5)
                <select id="reviewer-rating" required>
                  <option value="">Select rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </label>
              <label>Comment
                <textarea id="reviewer-comment" rows="4" placeholder="What did you like or dislike?" required></textarea>
              </label>
              <button class="btn" type="submit">Submit review</button>
              <p class="muted" id="review-submit-status"></p>
            </form>
          ` : `
            <div class="card product-review-form">
              <h3 style="margin-top:0;">Write a review</h3>
              <p class="muted">Sign in to write a review and have it saved to your account history.</p>
              <a class="btn" href="login.html">Sign in to review</a>
            </div>
          `}
        </div>
      </div>
    </section>
  `;

  const buyButton = document.getElementById('buy-button');
  if (buyButton) {
    buyButton.addEventListener('click', () => {
      const added = addToCart(product.id);
      if (added) showToast(`${product.name} added to cart.`, 'success');
    });
  }
  document.getElementById('wishlist-detail-btn')?.addEventListener('click', (e) => {
    const on = toggleWishlist(product.id);
    e.currentTarget.textContent = on ? '♥ Wishlisted' : '♡ Wishlist';
    showToast(on ? 'Saved to wishlist.' : 'Removed from wishlist.', 'success');
  });
  bindProductCardActions(document.getElementById('similar-products-rail') || document);

  const mainImage = document.getElementById('product-main-image');
  const thumbRow = document.getElementById('product-thumb-row');
  if (mainImage && thumbRow) {
    thumbRow.addEventListener('click', (event) => {
      const button = event.target.closest('[data-product-image]');
      if (!button) return;
      const src = button.getAttribute('data-product-image');
      if (!src) return;
      mainImage.src = src;
      thumbRow.querySelectorAll('.product-thumb').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
    });
  }

  loadProductReviews(product.id).then((reviews) => {
    const averageRating = reviews.length
      ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length)
      : 0;
    const ratingRow = document.getElementById('product-rating-row');
    const reviewList = document.getElementById('product-review-list');
    if (ratingRow) {
      ratingRow.innerHTML = `
        <span class="product-review-stars product-review-stars-lg">${renderRatingStars(Math.round(averageRating))}</span>
        <span class="muted">${averageRating ? averageRating.toFixed(1) : '0.0'} / 5 (${reviews.length} review${reviews.length === 1 ? '' : 's'})</span>
      `;
    }
    if (reviewList) {
      reviewList.innerHTML = reviews.length
        ? reviews.map((item) => {
            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';
            return `
              <article class="product-review-card">
                <div class="product-review-top">
                  <strong>${escapeHtml(item.name || 'Customer')}</strong>
                  <span class="product-review-stars">${renderRatingStars(item.rating)}</span>
                </div>
                <p>${escapeHtml(item.comment || '')}</p>
                <span class="product-review-date">${escapeHtml(createdAt)}</span>
              </article>
            `;
          }).join('')
        : '<p class="muted">No reviews yet. Be the first to review this product.</p>';
    }
  });

  const reviewForm = document.getElementById('product-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const rating = Number(document.getElementById('reviewer-rating')?.value || 0);
      const comment = String(document.getElementById('reviewer-comment')?.value || '').trim();
      const status = document.getElementById('review-submit-status');

      if (!rating || rating < 1 || rating > 5 || !comment) {
        if (status) status.textContent = 'Please add a rating and comment.';
        return;
      }

      if (!currentUser?.id) {
        if (status) status.textContent = 'Sign in to submit a review.';
        return;
      }

      if (status) status.textContent = 'Saving your review...';
      try {
        await saveProductReview(product.id, {
          userId: currentUser.id,
          name: currentUser.name || 'Customer',
          rating,
          comment
        });
        if (status) status.textContent = 'Review saved.';
        await renderProductDetail();
      } catch (error) {
        if (status) status.textContent = error.message || 'Unable to save review right now. Please ensure backend API is running on localhost:3001.';
      }
    });
  }
}

function initAdmin() {
  const adminPageType = document.body.dataset.adminPage || '';
  if (!adminPageType) return;

  const isDashboardPage = adminPageType === 'dashboard';
  const isCategoriesPage = adminPageType === 'categories' || adminPageType === 'category';
  const pageCategory = new URLSearchParams(window.location.search).get('category') || '';
  const nextPage = new URLSearchParams(window.location.search).get('next') || '';

  const loginForm = document.getElementById('login-form');
  const adminPanel = document.getElementById('admin-panel');

  // Stub admin pages: require session, then render feature UI.
  if (!loginForm || !adminPanel) {
    if (!ensureAdminAccess()) return;
    initAdminFeaturePages(adminPageType);
    return;
  }

  const logoutBtn = document.getElementById('logout-btn');
  const form = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const statusBox = document.getElementById('status');
  const editingIdInput = document.getElementById('editing-id');
  const categoryGrid = document.getElementById('admin-category-grid');
  const categorySelect = document.getElementById('category-select');
  const newCategoryInput = document.getElementById('new-category');
  const imageUrlsInput = document.getElementById('image-urls');
  const longDescriptionInput = document.getElementById('long-description');
  const selectedCategoryName = document.getElementById('selected-category-name');
  const productPanel = document.getElementById('admin-product-panel');
  const productFormContainer = document.getElementById('product-form-container');
  const showAddProductBtn = document.getElementById('show-add-product');
  let selectedCategory = null;

  function showPanel(visible) {
    document.body.classList.toggle('admin-authed', !!visible);
    adminPanel.classList.toggle('hide', !visible);
    loginForm.classList.toggle('hide', visible);
    if (logoutBtn) logoutBtn.style.display = visible ? 'inline-block' : 'none';
  }

  function getCategoryImage(category) {
    // First check if there's a custom image in localStorage
    const categoryImages = JSON.parse(localStorage.getItem('bean-bloom-category-images') || '{}');
    if (categoryImages[category]) {
      return categoryImages[category];
    }

    return categoryFallbackImages[category] || DEFAULT_IMAGE_URL;
  }

  function renderCategoryOptions(selected) {
    if (!categorySelect) return; // Skip if element doesn't exist
    const categories = loadCategories();
    categorySelect.innerHTML = '<option value="">Select category</option>' + categories.map((category) => {
      return `<option value="${escapeHtml(category)}"${selected === category ? ' selected' : ''}>${escapeHtml(category)}</option>`;
    }).join('');
  }

  function renderAdminCategoryGrid(activeCategory) {
    if (!categoryGrid) return;
    const categories = loadCategories();
    categoryGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const isDashboardPage = document.body.dataset.adminPage === 'dashboard';

    categories.forEach((category) => {
      let card;
      if (isDashboardPage) {
        card = document.createElement('a');
        card.href = 'admin-product-categories.html';
      } else {
        card = document.createElement('button');
        card.type = 'button';
        card.dataset.category = category;
      }
      card.className = `admin-category-card${category === activeCategory ? ' active' : ''}`;
      card.innerHTML = `
        <div class="category-card-image" style="background-image: url('${getCategoryImage(category)}');"></div>
        <div class="category-card-overlay"></div>
        <div class="category-card-content">
          <h4>${escapeHtml(category)}</h4>
          <p>View products in this category.</p>
        </div>
      `;
      fragment.appendChild(card);
    });

    const addCard = document.createElement('button');
    addCard.type = 'button';
    addCard.className = 'category-card-add';
    addCard.dataset.action = 'add-category';
    addCard.innerHTML = '<span>+ Add category</span>';
    fragment.appendChild(addCard);

    categoryGrid.appendChild(fragment);
  }

  function selectCategory(category) {
    selectedCategory = category || null;
    if (selectedCategoryName) selectedCategoryName.textContent = selectedCategory || '';
    if (productPanel) productPanel.classList.toggle('hide', !selectedCategory);
    if (statusBox) {
      statusBox.textContent = selectedCategory
        ? `Showing products in "${selectedCategory}".`
        : 'Select a category to manage products.';
    }
    renderAdminCategoryGrid(selectedCategory);
    if (typeof renderAdminProducts === 'function') renderAdminProducts();
  }

  function showProductForm(title = 'Add product') {
    if (!productFormContainer) return;
    const titleEl = document.getElementById('product-form-title');
    if (titleEl) titleEl.textContent = title;
    productFormContainer.classList.remove('hide');
    if (categorySelect) categorySelect.value = selectedCategory || '';
    if (newCategoryInput) newCategoryInput.value = '';
    document.getElementById('name')?.focus();
  }

  function hideProductForm() {
    if (!productFormContainer) return;
    productFormContainer.classList.add('hide');
    if (form) form.reset();
    if (editingIdInput) editingIdInput.value = '';
  }

  const isLoggedIn = isAdminLoggedIn();
  showPanel(isLoggedIn);
  if (isLoggedIn) {
    renderAdminMetrics();
    if (isCategoriesPage) {
      renderAdminCategoryGrid(null);
    }
    initAdminFeaturePages(adminPageType);
  }

  // Category page specific functions
  if (isCategoriesPage) {
    const categoryDetailsPanel = document.getElementById('admin-category-details');
    const backBtn = document.getElementById('back-to-categories');
    const categoryImageUrlInput = document.getElementById('category-image-url');
    const updateCategoryImageBtn = document.getElementById('update-category-image');
    const categoryProductList = document.getElementById('category-product-list');
    const showAddProductBtn2 = document.getElementById('show-add-product-btn');
    const productFormContainer2 = document.getElementById('product-form-container');
    const categoryProductForm = document.getElementById('category-product-form');
    const editingProductId = document.getElementById('editing-product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productImageInput = document.getElementById('product-image-url') || document.getElementById('image-url');
    const productImageUrlsInput = document.getElementById('product-image-urls') || document.getElementById('image-urls');
    const productDescInput = document.getElementById('product-description') || document.getElementById('description');
    const productLongDescInput = document.getElementById('product-long-description') || document.getElementById('long-description');
    const productFeaturedInput = document.getElementById('product-featured') || document.getElementById('featured');
    const cancelProductFormBtn = document.getElementById('cancel-product-form');
    const categoryNameDisplay = document.getElementById('selected-category-name');
    const categoryProductCount = document.getElementById('category-product-count');

    let selectedCategory2 = null;
    let categoryImageCache = {};

    // Load category images from localStorage
    function loadCategoryImages() {
      const saved = localStorage.getItem('bean-bloom-category-images');
      return saved ? JSON.parse(saved) : {};
    }

    function saveCategoryImages(images) {
      localStorage.setItem('bean-bloom-category-images', JSON.stringify(images));
    }

    function getCategoryImageForPage(category) {
      categoryImageCache = loadCategoryImages();
      return categoryImageCache[category] || getCategoryImage(category);
    }

    function renderCategoryProductsForPage() {
      if (!categoryProductList || !selectedCategory2) return;
      
      let products = loadProducts().filter(p => p.category === selectedCategory2);
      const count = products.length;
      categoryProductCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;

      categoryProductList.innerHTML = '';
      if (!products.length) {
        categoryProductList.innerHTML = '<p class="muted" style="padding: 1rem; text-align: center;">No products in this category yet.</p>';
        return;
      }

      const fragment = document.createDocumentFragment();
      products.forEach(product => {
        const imageSrc = product.imageUrl ? escapeHtml(product.imageUrl) : DEFAULT_IMAGE_URL;
        const card = document.createElement('article');
        card.className = 'card';
        card.style.cssText = 'display: grid; grid-template-columns: 100px 1fr; gap: 1rem; align-items: start;';
        card.innerHTML = `
          <img class="product-image" src="${imageSrc}" alt="${escapeHtml(product.name)}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px;">
          <div>
            <div class="badge">${escapeHtml(product.category || 'Coffee')}</div>
            <h3 style="margin: 0.5rem 0;">${escapeHtml(product.name)}</h3>
            <p class="muted" style="margin: 0.5rem 0; font-size: 0.9rem;">${escapeHtml(product.description || 'Freshly made with care.')}</p>
            <div class="price" style="margin: 0.8rem 0;">${formatCurrencyAmount(Number(product.price))}</div>
            ${product.featured ? '<div class="badge" style="background: var(--accent); color: white;">Featured</div>' : ''}
            <div class="inline-actions" style="margin-top: 0.8rem;">
              <button class="btn secondary" type="button" data-toggle-featured-product="${product.id}">${product.featured ? 'Remove featured' : 'Add to featured'}</button>
              <button class="btn secondary" type="button" data-edit-product="${product.id}">Edit</button>
              <button class="btn" type="button" data-delete-product="${product.id}">Delete</button>
            </div>
          </div>
        `;
        fragment.appendChild(card);
      });
      categoryProductList.appendChild(fragment);
    }

    function showCategoryDetails(category) {
      selectedCategory2 = category;
      categoryNameDisplay.textContent = category;
      categoryImageUrlInput.value = getCategoryImageForPage(category);
      
      const categoriesSection = document.querySelector('.admin-category-grid-card');
      if (categoriesSection) categoriesSection.classList.add('hide');
      
      if (categoryDetailsPanel) categoryDetailsPanel.classList.remove('hide');
      renderCategoryProductsForPage();
      hideCategoryProductForm();
    }

    function hideCategoryDetails() {
      selectedCategory2 = null;
      const categoriesSection = document.querySelector('.admin-category-grid-card');
      if (categoriesSection) categoriesSection.classList.remove('hide');
      if (categoryDetailsPanel) categoryDetailsPanel.classList.add('hide');
      hideCategoryProductForm();
    }

    function showCategoryProductForm(title = 'Add product') {
      if (!productFormContainer2) return;
      document.getElementById('product-form-title').textContent = title;
      productFormContainer2.classList.remove('hide');
      productNameInput.focus();
    }

    function hideCategoryProductForm() {
      if (productFormContainer2) productFormContainer2.classList.add('hide');
      if (categoryProductForm) categoryProductForm.reset();
      if (editingProductId) editingProductId.value = '';
    }

    // Expose functions globally for use in event listeners
    window.__showCategoryDetails = showCategoryDetails;
    window.__hideCategoryDetails = hideCategoryDetails;

    // Event listeners for category page
    if (backBtn) {
      backBtn.addEventListener('click', hideCategoryDetails);
    }

    if (updateCategoryImageBtn) {
      updateCategoryImageBtn.addEventListener('click', () => {
        if (!selectedCategory2 || !categoryImageUrlInput.value) return;
        categoryImageCache = loadCategoryImages();
        categoryImageCache[selectedCategory2] = categoryImageUrlInput.value;
        saveCategoryImages(categoryImageCache);
        alert('Category image updated!');
      });
    }

    if (showAddProductBtn2) {
      showAddProductBtn2.addEventListener('click', () => {
        showCategoryProductForm('Add product');
      });
    }

    if (cancelProductFormBtn) {
      cancelProductFormBtn.addEventListener('click', hideCategoryProductForm);
    }

    if (categoryProductForm) {
      categoryProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const products = loadProducts();
        const id = editingProductId.value;
        const images = parseImageUrlsInput([
          productImageInput?.value || '',
          productImageUrlsInput?.value || ''
        ].join('\n'));
        
        const product = {
          id: id || crypto.randomUUID(),
          name: productNameInput?.value,
          price: parseFloat(productPriceInput?.value || 0),
          category: selectedCategory2,
          imageUrl: images[0] || DEFAULT_IMAGE_URL,
          imageUrls: images.length ? images : [DEFAULT_IMAGE_URL],
          description: productDescInput?.value,
          longDescription: productLongDescInput?.value,
          featured: !!productFeaturedInput?.checked
        };

        if (!product.name) {
          alert('Please add a product name.');
          return;
        }

        const index = products.findIndex(item => item.id === id);
        if (index >= 0) {
          products[index] = product;
        } else {
          products.unshift(product);
        }

        saveProducts(products);
        categoryProductForm.reset();
        editingProductId.value = '';
        renderCategoryProductsForPage();
        renderPublicProducts();
        hideCategoryProductForm();
        alert(id ? 'Product updated!' : 'Product added!');
      });
    }

    if (categoryProductList) {
      categoryProductList.addEventListener('click', (event) => {
        const editBtn = event.target.getAttribute('data-edit-product');
        const deleteBtn = event.target.getAttribute('data-delete-product');
        const toggleFeaturedBtn = event.target.getAttribute('data-toggle-featured-product');
        const products = loadProducts();

        if (toggleFeaturedBtn) {
          toggleFeaturedStatus(toggleFeaturedBtn);
          renderCategoryProductsForPage();
          return;
        }

        if (editBtn) {
          const product = products.find(p => p.id === editBtn);
          if (product) {
            editingProductId.value = product.id;
            productNameInput.value = product.name;
            productPriceInput.value = product.price;
            if (productImageInput) productImageInput.value = product.imageUrl || '';
            if (productImageUrlsInput) productImageUrlsInput.value = (product.imageUrls || []).slice(1).join('\n');
            if (productDescInput) productDescInput.value = product.description || '';
            if (productLongDescInput) productLongDescInput.value = product.longDescription || '';
            if (productFeaturedInput) productFeaturedInput.checked = !!product.featured;
            showCategoryProductForm('Edit product');
          }
        }

        if (deleteBtn) {
          if (confirm('Delete this product?')) {
            const updated = products.filter(p => p.id !== deleteBtn);
            saveProducts(updated);
            renderCategoryProductsForPage();
            renderPublicProducts();
          }
        }
      });
    }
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username')?.value?.trim();
    const password = document.getElementById('password')?.value;
    if (username === 'admin' && password === 'admin') {
      setAdminLoggedIn(true);
      if (nextPage && /^admin[\w.-]*\.html(\?.*)?$/.test(nextPage)) {
        window.location.href = nextPage;
        return;
      }
      showPanel(true);
      if (isDashboardPage || isCategoriesPage) {
        selectCategory(isCategoriesPage ? (pageCategory || null) : null);
        renderCategoryOptions(selectedCategory);
        renderAdminCategoryGrid(selectedCategory);
        if (productList) renderAdminProducts();
      }
      renderAdminMetrics();
      initAdminFeaturePages(adminPageType);
      if (statusBox) statusBox.textContent = 'Admin access granted.';
      if (adminPageType === 'settings') {
        document.getElementById('admin-panel')?.classList.remove('hide');
      }
    } else {
      if (statusBox) statusBox.textContent = 'Use admin / admin to enter the dashboard.';
      else showToast('Use admin / admin to enter the dashboard.', 'info');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    setAdminLoggedIn(false);
    showPanel(false);
    if (form) form.reset();
    if (editingIdInput) editingIdInput.value = '';
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const products = loadProducts();
      const id = editingIdInput.value;
      const selectedCategoryValue = categorySelect.value;
      const newCategoryValue = newCategoryInput.value.trim();
      const categoryValue = newCategoryValue || selectedCategoryValue;
      if (!categoryValue) {
        statusBox.textContent = 'Please select or create a category for this product.';
        return;
      }
      if (newCategoryValue) {
        ensureCategory(newCategoryValue);
        renderCategoryOptions(newCategoryValue);
      }
      const imageUrls = parseImageUrlsInput([
        document.getElementById('image-url')?.value || '',
        imageUrlsInput?.value || ''
      ].join('\n'));
      const product = {
        id: id || crypto.randomUUID(),
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value || 0),
        category: categoryValue,
        imageUrl: imageUrls[0] || DEFAULT_IMAGE_URL,
        imageUrls: imageUrls.length ? imageUrls : [DEFAULT_IMAGE_URL],
        description: document.getElementById('description').value,
        longDescription: longDescriptionInput?.value || '',
        featured: document.getElementById('featured').checked
      };

      if (!product.name) {
        statusBox.textContent = 'Please add a product name.';
        return;
      }

      const index = products.findIndex(item => item.id === id);
      if (index >= 0) {
        products[index] = product;
      } else {
        products.unshift(product);
      }

      saveProducts(products);
      form.reset();
      editingIdInput.value = '';
      newCategoryInput.value = '';
      renderCategoryOptions(selectedCategory);
      renderAdminCategoryGrid(selectedCategory);
      renderAdminProducts();
      renderAdminMetrics();
      renderPublicProducts();
      statusBox.textContent = id ? 'Product updated.' : 'Product added.';
    });
  }

  function renderAdminMetrics() {
    const products = loadProducts();
    const featuredCount = products.filter((product) => product.featured).length;
    const averagePrice = products.length ? products.reduce((sum, item) => sum + Number(item.price || 0), 0) / products.length : 0;
    const orders = loadAllOrders();
    const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
    const productsEl = document.getElementById('metric-products');
    const featuredEl = document.getElementById('metric-featured');
    const ordersEl = document.getElementById('metric-orders');
    const revenueEl = document.getElementById('metric-revenue');
    const lowStockEl = document.getElementById('metric-low-stock');
    const avgPriceEl = document.getElementById('metric-average-price');
    if (productsEl) productsEl.textContent = products.length;
    if (featuredEl) featuredEl.textContent = featuredCount;
    if (ordersEl) ordersEl.textContent = orders.length;
    if (revenueEl) revenueEl.textContent = formatCurrencyAmount(revenue);
    if (lowStockEl) lowStockEl.textContent = lowStock;
    if (avgPriceEl) avgPriceEl.textContent = formatCurrencyAmount(averagePrice);
  }

  function toggleFeaturedStatus(productId) {
    const products = loadProducts();
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    product.featured = !product.featured;
    saveProducts(products);
    renderAdminProducts();
    renderPublicProducts();
    renderAdminMetrics();
    if (statusBox) statusBox.textContent = product.featured ? 'Product added to featured items.' : 'Product removed from featured items.';
  }

  function renderAdminProducts() {
    if (!productList) return; // Skip if element doesn't exist (e.g., on categories page)
    let products = loadProducts();
    if (selectedCategory) {
      products = products.filter((product) => product.category === selectedCategory);
    }
    productList.innerHTML = '';
    if (!products.length) {
      const message = selectedCategory ? `No products in "${selectedCategory}" yet.` : 'No products yet.';
      productList.innerHTML = `<div class="card"><p class="muted">${escapeHtml(message)}</p></div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    products.forEach(product => {
      const imageSrc = product.imageUrl ? escapeHtml(product.imageUrl) : DEFAULT_IMAGE_URL;
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="product-image" src="${imageSrc}" alt="${escapeHtml(product.name)}">
        <div class="badge">${escapeHtml(product.category || 'Coffee')}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="muted">${escapeHtml(product.description || 'Freshly made with care.')}</p>
        <div class="price">${formatCurrencyAmount(Number(product.price))}</div>
        ${product.featured ? '<div class="badge" style="background: var(--accent); color: white;">Featured</div>' : ''}
        <div class="inline-actions">
          <button class="btn secondary" type="button" data-toggle-featured="${product.id}">${product.featured ? 'Remove featured' : 'Add to featured'}</button>
          <button class="btn secondary" type="button" data-edit="${product.id}">Edit</button>
          <button class="btn" type="button" data-delete="${product.id}">Delete</button>
        </div>
      `;
      fragment.appendChild(card);
    });
    productList.appendChild(fragment);
  }

  function addCategory(name) {
    const categoryName = normalizeCategory(name);
    if (!categoryName) {
      if (statusBox) statusBox.textContent = 'Enter a category name.';
      else showToast('Enter a category name.', 'info');
      return false;
    }
    const categories = loadCategories();
    if (categories.some(item => item.toLowerCase() === categoryName.toLowerCase())) {
      if (statusBox) statusBox.textContent = 'Category already exists.';
      else showToast('Category already exists.', 'info');
      return false;
    }
    categories.unshift(categoryName);
    saveCategories(categories);
    renderCategoryOptions(categoryName);
    renderAdminCategoryGrid(selectedCategory);
    if (statusBox) statusBox.textContent = 'Category added.';
    else showToast('Category added.', 'success');
    return true;
  }

  if (categoryGrid) {
    categoryGrid.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const action = button.getAttribute('data-action');
      const category = button.getAttribute('data-category');
      
      if (action === 'add-category') {
        const name = prompt('New category name');
        if (name) {
          if (addCategory(name)) {
            if (isDashboardPage) {
              selectCategory(name);
            } else {
              // On categories page, add and refresh grid
              renderAdminCategoryGrid(null);
            }
          }
        }
        return;
      }
      
      if (category) {
        if (isDashboardPage) {
          selectCategory(category);
        } else {
          // On categories page, show details - this function is defined above
          const showDetailsFunc = window.__showCategoryDetails;
          if (showDetailsFunc) showDetailsFunc(category);
        }
      }
    });
  }

  if (showAddProductBtn) {
    showAddProductBtn.addEventListener('click', () => {
      if (!selectedCategory) {
        statusBox.textContent = 'Select a category first to add a product under it.';
        return;
      }
      hideProductForm();
      showProductForm('Add product');
    });
  }

  if (!isDashboardPage && pageCategory) {
    selectCategory(pageCategory);
  }

  function handleProductEdit(product) {
    editingIdInput.value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    renderCategoryOptions(product.category);
    newCategoryInput.value = '';
    document.getElementById('image-url').value = product.imageUrl || '';
    if (imageUrlsInput) imageUrlsInput.value = (product.imageUrls || []).slice(1).join('\n');
    document.getElementById('description').value = product.description || '';
    if (longDescriptionInput) longDescriptionInput.value = product.longDescription || '';
    document.getElementById('featured').checked = !!product.featured;
    showProductForm('Edit product');
    statusBox.textContent = 'Editing product.';
  }

  if (isCategoriesPage) {
    renderAdminCategoryGrid(selectedCategory);
  } else if (isDashboardPage) {
    renderAdminMetrics();
  }

  if (productList) {
    productList.addEventListener('click', (event) => {
      const editId = event.target.getAttribute('data-edit');
      const deleteId = event.target.getAttribute('data-delete');
      const toggleFeaturedId = event.target.getAttribute('data-toggle-featured');
      const products = loadProducts();
      if (toggleFeaturedId) {
        toggleFeaturedStatus(toggleFeaturedId);
        return;
      }
      if (editId) {
        const product = products.find(item => item.id === editId);
        if (product) {
          handleProductEdit(product);
        }
      }
      if (deleteId) {
        const updated = products.filter(item => item.id !== deleteId);
        saveProducts(updated);
        renderAdminProducts();
        renderPublicProducts();
        if (statusBox) statusBox.textContent = 'Product removed.';
      }
    });
  }
}

function renderUserNav() {
  const container = document.getElementById('user-nav');
  if (!container) return;

  const raw = sessionStorage.getItem(USER_SESSION_KEY) || localStorage.getItem(USER_SESSION_KEY);
  if (raw) {
    try {
      const user = JSON.parse(raw);
      const firstName = user.name ? user.name.split(' ')[0] : 'Account';
      container.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:.5rem;">
          <a href="orders.html" style="font-weight:700;color:var(--muted);font-size:.9rem;">My Orders</a>
          <a href="orders.html" style="font-weight:700;color:var(--accent);">Hi, ${escapeHtml(firstName)}</a>
          <button id="user-logout-btn" class="btn secondary" type="button" style="padding:.4rem .8rem;font-size:.85rem;">Sign out</button>
        </span>`;
      document.getElementById('user-logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem(USER_SESSION_KEY);
        localStorage.removeItem(USER_SESSION_KEY);
        window.location.reload();
      });
    } catch {}
  } else {
    container.innerHTML = `<a href="login.html" class="btn secondary" style="padding:.45rem .9rem;font-size:.9rem;font-weight:700;">Sign in</a>`;
  }
}

async function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const topicInput = document.getElementById('contact-topic');
  const status = document.getElementById('contact-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = String(nameInput?.value || '').trim();
    const email = String(emailInput?.value || '').trim();
    const message = String(messageInput?.value || '').trim();
    const topic = String(topicInput?.value || 'general').trim();

    if (!name || !email || !message) {
      if (status) status.textContent = 'Please fill in name, email, and message.';
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = 'Sending your enquiry...';

    const payload = {
      name,
      email,
      message: topic && topic !== 'general' ? `[${topic}] ${message}` : message
    };

    try {
      const response = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = 'Unable to send enquiry right now.';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      form.reset();
      if (status) status.textContent = 'Thanks. Your enquiry has been submitted.';
      showToast('Enquiry sent. We’ll reply soon.', 'success');
    } catch (error) {
      try {
        const key = 'bean-bloom-inquiries-local';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const list = Array.isArray(existing) ? existing : [];
        list.unshift({ ...payload, created_at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
        form.reset();
        if (status) status.textContent = 'Saved locally. We’ll sync when the cafe server is online.';
        showToast('Enquiry saved on this device.', 'info');
      } catch {
        if (status) status.textContent = 'Unable to send enquiry right now. Please try again later or email hello@beanandbloom.com.';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

async function renderAdminInquiries() {
  const root = document.getElementById('admin-inquiries-list');
  if (!root) return;

  root.innerHTML = '<p class="muted">Loading enquiries...</p>';
  let inquiries = [];
  try {
    const response = await fetch(`${API_BASE}/inquiries`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) inquiries = data;
    }
  } catch {}

  const local = loadLocalInquiries().map((item) => ({
    ...item,
    source: 'local'
  }));
  inquiries = [...inquiries.map((item) => ({ ...item, source: 'api' })), ...local]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  if (!inquiries.length) {
    root.innerHTML = '<p class="muted">No enquiries yet.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  inquiries.forEach((inquiry) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h4 style="margin:.2rem 0 .35rem;">${escapeHtml(inquiry.name || 'Customer')}</h4>
      <p class="muted" style="margin:0;">${escapeHtml(inquiry.email || '')}${inquiry.source === 'local' ? ' · saved locally' : ''}</p>
      <p style="margin:.85rem 0 .6rem;">${escapeHtml(inquiry.message || '')}</p>
      <p class="muted" style="margin:0;font-size:.85rem;">${inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : ''}</p>
    `;
    fragment.appendChild(card);
  });

  root.innerHTML = '';
  root.appendChild(fragment);
}

function initAdminFeaturePages(pageType) {
  if (pageType === 'orders') renderAdminOrdersPage();
  if (pageType === 'customers') renderAdminCustomersPage();
  if (pageType === 'inventory') renderAdminInventoryPage();
  if (pageType === 'analytics') renderAdminAnalyticsPage();
  if (pageType === 'discounts') renderAdminDiscountsPage();
}

function getOrdersDateFilter() {
  return {
    from: document.getElementById('orders-date-from')?.value || '',
    to: document.getElementById('orders-date-to')?.value || ''
  };
}

function bindOrdersDateFilter() {
  const apply = document.getElementById('orders-apply-range');
  if (!apply || apply.dataset.bound === 'true') return;
  apply.dataset.bound = 'true';
  apply.addEventListener('click', () => renderAdminOrdersPage());
  document.querySelectorAll('[data-orders-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDateRangePreset('orders-date-from', 'orders-date-to', btn.getAttribute('data-orders-preset'));
      renderAdminOrdersPage();
    });
  });
}

function renderAdminOrdersPage() {
  const root = document.getElementById('admin-orders-list');
  if (!root) return;
  bindOrdersDateFilter();
  const { from, to } = getOrdersDateFilter();
  const orders = filterOrdersByDateRange(loadAllOrders(), from, to);
  const summary = document.getElementById('admin-orders-summary');
  if (summary) {
    const paid = orders.filter((o) => o.status === 'Paid' || o.paymentVerified).length;
    const verified = orders.filter((o) => o.paymentVerified).length;
    const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    summary.innerHTML = `
      <p class="muted" style="margin:0 0 .8rem;">Showing ${orders.length} order${orders.length === 1 ? '' : 's'}${from || to ? ` · ${from || '…'} → ${to || '…'}` : ' · all time'}.</p>
      <div class="stats-grid">
        <article class="stat-card"><p class="stat-label">Orders</p><strong>${orders.length}</strong></article>
        <article class="stat-card"><p class="stat-label">Paid / pending verify</p><strong>${paid}</strong></article>
        <article class="stat-card"><p class="stat-label">Payment verified</p><strong>${verified}</strong></article>
        <article class="stat-card"><p class="stat-label">Revenue</p><strong>${formatCurrencyAmount(revenue)}</strong></article>
      </div>`;
  }
  if (!orders.length) {
    root.innerHTML = '<div class="card"><p class="muted">No orders in this date range.</p></div>';
    return;
  }
  root.innerHTML = orders.map((order) => {
    const addr = order.address || {};
    const meta = order.paymentMeta || {};
    const items = (order.items || []).map((item) => `${escapeHtml(item.name)} × ${item.quantity}`).join(', ');
    const paymentId = meta.razorpayPaymentId || meta.razorpay_payment_id || '—';
    const verified = !!order.paymentVerified;
    return `
      <article class="card" style="margin-bottom:1rem;" data-order-id="${escapeHtml(order.id)}">
        <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:start;">
          <div>
            <h3 style="margin:0 0 .35rem;font-family:var(--font-display,inherit);">${escapeHtml(order.id)}</h3>
            <p class="muted" style="margin:0;">${new Date(order.date).toLocaleString('en-IN')} · ${escapeHtml(addr.name || 'Customer')} · ${escapeHtml(addr.city || '')}</p>
            <p style="margin:.7rem 0 0;font-size:.92rem;">${items || 'No items'}</p>
            <p class="muted" style="margin:.45rem 0 0;font-size:.85rem;">⚡ Razorpay · Payment ID: <code>${escapeHtml(paymentId)}</code></p>
            <p class="muted" style="margin:.35rem 0 0;font-size:.85rem;">Payment status: <strong style="color:${verified ? '#166534' : '#92400e'};">${verified ? 'Verified' : 'Awaiting verification'}</strong>${order.paymentVerifiedAt ? ` · ${new Date(order.paymentVerifiedAt).toLocaleString('en-IN')}` : ''}</p>
          </div>
          <div style="text-align:right;display:grid;gap:.55rem;justify-items:end;">
            <strong>${formatCurrencyAmount(order.total)}</strong>
            <select data-order-status="${escapeHtml(order.id)}" style="min-width:140px;">
              ${['Confirmed', 'Paid', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'].map((status) => `
                <option value="${status}"${order.status === status ? ' selected' : ''}>${status}</option>
              `).join('')}
            </select>
            <button class="btn ${verified ? 'secondary' : ''}" type="button" data-verify-payment="${escapeHtml(order.id)}" style="margin:0;">
              ${verified ? 'Mark unverified' : 'Verify Razorpay payment'}
            </button>
          </div>
        </div>
      </article>`;
  }).join('');
  root.querySelectorAll('[data-order-status]').forEach((select) => {
    select.addEventListener('change', () => {
      const id = select.getAttribute('data-order-status');
      updateStoredOrder(id, (order) => ({ ...order, status: select.value }));
      showToast(`Order ${id} marked ${select.value}.`, 'success');
      renderAdminOrdersPage();
    });
  });
  root.querySelectorAll('[data-verify-payment]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-verify-payment');
      const updated = updateStoredOrder(id, (order) => {
        const nextVerified = !order.paymentVerified;
        return {
          ...order,
          paymentVerified: nextVerified,
          paymentVerifiedAt: nextVerified ? new Date().toISOString() : null,
          status: nextVerified ? (order.status === 'Confirmed' ? 'Paid' : order.status) : order.status
        };
      });
      if (updated && window.BeanbBloomAPI?.Orders?.verifyPayment) {
        window.BeanbBloomAPI.Orders.verifyPayment(id, !!updated.paymentVerified).catch(() => {});
      }
      showToast(`Payment for ${id} updated.`, 'success');
      renderAdminOrdersPage();
    });
  });
}

function renderAdminDiscountsPage() {
  const listRoot = document.getElementById('admin-discounts-list');
  const form = document.getElementById('discount-form');
  if (!listRoot || !form) return;

  const typeSelect = document.getElementById('discount-type');
  const categoryField = document.getElementById('discount-category-wrap');
  const productField = document.getElementById('discount-product-wrap');
  const categorySelect = document.getElementById('discount-category');
  const productSelect = document.getElementById('discount-product');

  const categories = loadCategories();
  const products = loadProducts();
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Select category</option>' + categories.map((c) =>
      `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }
  if (productSelect) {
    productSelect.innerHTML = '<option value="">Select product</option>' + products.map((p) =>
      `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} (${escapeHtml(p.category || '')})</option>`).join('');
  }

  const syncScopeFields = () => {
    const type = typeSelect?.value || 'store';
    if (categoryField) categoryField.style.display = type === 'category' ? '' : 'none';
    if (productField) productField.style.display = type === 'product' ? '' : 'none';
  };
  if (typeSelect && !typeSelect.dataset.bound) {
    typeSelect.dataset.bound = 'true';
    typeSelect.addEventListener('change', syncScopeFields);
  }
  syncScopeFields();

  const discounts = loadDiscounts();
  listRoot.innerHTML = discounts.length ? discounts.map((d) => `
    <article class="card" style="margin-bottom:.8rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:center;">
      <div>
        <strong>${escapeHtml(d.name)}</strong>
        <p class="muted" style="margin:.3rem 0 0;font-size:.88rem;">
          ${escapeHtml(d.type)} · ${d.valueType === 'fixed' ? formatCurrencyAmount(d.value) : `${d.value}%`}
          ${d.type === 'category' ? ` · ${escapeHtml(d.category)}` : ''}
          ${d.type === 'product' ? ` · ${escapeHtml(products.find((p) => p.id === d.productId)?.name || d.productId)}` : ''}
          · ${d.active ? 'Active' : 'Inactive'}
        </p>
      </div>
      <div style="display:flex;gap:.5rem;">
        <button class="btn secondary" type="button" data-toggle-discount="${escapeHtml(d.id)}" style="margin:0;">${d.active ? 'Disable' : 'Enable'}</button>
        <button class="btn secondary" type="button" data-delete-discount="${escapeHtml(d.id)}" style="margin:0;">Delete</button>
      </div>
    </article>
  `).join('') : '<p class="muted">No discounts yet. Add a store-wide, category, or product discount above.</p>';

  listRoot.querySelectorAll('[data-toggle-discount]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-discount');
      const next = loadDiscounts().map((d) => d.id === id ? { ...d, active: !d.active } : d);
      saveDiscounts(next);
      renderAdminDiscountsPage();
    });
  });
  listRoot.querySelectorAll('[data-delete-discount]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-discount');
      saveDiscounts(loadDiscounts().filter((d) => d.id !== id));
      showToast('Discount removed.', 'success');
      renderAdminDiscountsPage();
    });
  });

  if (!form.dataset.bound) {
    form.dataset.bound = 'true';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('discount-type')?.value || 'store';
      const discount = normalizeDiscount({
        name: document.getElementById('discount-name')?.value,
        type,
        valueType: document.getElementById('discount-value-type')?.value || 'percent',
        value: document.getElementById('discount-value')?.value,
        category: document.getElementById('discount-category')?.value,
        productId: document.getElementById('discount-product')?.value,
        code: document.getElementById('discount-code')?.value,
        active: true
      });
      if (!discount) {
        showToast('Enter a valid discount value.', 'error');
        return;
      }
      if (type === 'category' && !discount.category) {
        showToast('Select a category for this discount.', 'error');
        return;
      }
      if (type === 'product' && !discount.productId) {
        showToast('Select a product for this discount.', 'error');
        return;
      }
      saveDiscounts([discount, ...loadDiscounts()]);
      form.reset();
      syncScopeFields();
      showToast('Discount saved.', 'success');
      renderAdminDiscountsPage();
    });
  }
}

function renderAdminCustomersPage() {
  const customersRoot = document.getElementById('admin-customers-list');
  if (customersRoot) {
    const customers = loadRegisteredCustomers();
    if (!customers.length) {
      customersRoot.innerHTML = '<p class="muted">No registered customers yet.</p>';
    } else {
      customersRoot.innerHTML = customers.map((customer) => `
        <article class="card" style="margin-bottom:.8rem;">
          <h4 style="margin:0 0 .35rem;">${escapeHtml(customer.name || 'Customer')}</h4>
          <p class="muted" style="margin:0;">${escapeHtml(customer.email || '')}${customer.phone ? ` · ${escapeHtml(customer.phone)}` : ''}</p>
          <p class="muted" style="margin:.45rem 0 0;font-size:.85rem;">Joined ${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN') : '—'}</p>
        </article>
      `).join('');
    }
  }
  renderAdminInquiries();
}

function renderAdminInventoryPage() {
  const root = document.getElementById('admin-inventory-list');
  if (!root) return;
  const products = loadProducts();
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
  const summary = document.getElementById('admin-inventory-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="stats-grid">
        <article class="stat-card"><p class="stat-label">SKU count</p><strong>${products.length}</strong></article>
        <article class="stat-card"><p class="stat-label">Low stock (≤5)</p><strong>${lowStock}</strong></article>
        <article class="stat-card"><p class="stat-label">Out of stock</p><strong>${products.filter((p) => Number(p.stock) <= 0).length}</strong></article>
      </div>`;
  }

  root.innerHTML = products.map((product) => `
    <article class="card" style="display:grid;grid-template-columns:72px 1fr auto;gap:1rem;align-items:center;margin-bottom:.8rem;">
      <img src="${escapeHtml(optimizeImageUrl(product.imageUrl || DEFAULT_IMAGE_URL, 120, 70))}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;">
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <p class="muted" style="margin:.25rem 0 0;font-size:.88rem;">${escapeHtml(product.category || '')} · ${formatCurrencyAmount(product.price)}</p>
      </div>
      <label style="margin:0;min-width:110px;">Stock
        <input type="number" min="0" value="${Number(product.stock)}" data-stock-id="${escapeHtml(product.id)}" style="width:100%;">
      </label>
    </article>
  `).join('') || '<div class="card"><p class="muted">No products in inventory.</p></div>';

  root.querySelectorAll('[data-stock-id]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.getAttribute('data-stock-id');
      const productsList = loadProducts();
      const product = productsList.find((item) => item.id === id);
      if (!product) return;
      product.stock = Math.max(0, Number(input.value) || 0);
      saveProducts(productsList);
      showToast(`${product.name} stock updated to ${product.stock}.`, 'success');
      renderAdminInventoryPage();
    });
  });
}

function getAnalyticsDateFilter() {
  return {
    from: document.getElementById('analytics-date-from')?.value || '',
    to: document.getElementById('analytics-date-to')?.value || ''
  };
}

function bindAnalyticsDateFilter() {
  const apply = document.getElementById('analytics-apply-range');
  if (!apply || apply.dataset.bound === 'true') return;
  apply.dataset.bound = 'true';
  apply.addEventListener('click', () => renderAdminAnalyticsPage());
  document.querySelectorAll('[data-range-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDateRangePreset('analytics-date-from', 'analytics-date-to', btn.getAttribute('data-range-preset'));
      renderAdminAnalyticsPage();
    });
  });
  const from = document.getElementById('analytics-date-from');
  const to = document.getElementById('analytics-date-to');
  if (from && to && !from.value && !to.value && !apply.dataset.defaulted) {
    apply.dataset.defaulted = 'true';
    setDateRangePreset('analytics-date-from', 'analytics-date-to', 30);
  }
}

function renderAdminAnalyticsPage() {
  const root = document.getElementById('admin-analytics-panel');
  if (!root) return;
  bindAnalyticsDateFilter();
  const { from, to } = getAnalyticsDateFilter();
  const allOrders = loadAllOrders();
  const orders = filterOrdersByDateRange(allOrders, from, to);
  const products = loadProducts();
  const customers = loadRegisteredCustomers();
  const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const itemsSold = orders.reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + Number(i.quantity || 0), 0), 0);
  const avgOrder = orders.length ? revenue / orders.length : 0;
  const discountGiven = orders.reduce((sum, o) => sum + Number(o.discountTotal || 0), 0);
  const verified = orders.filter((o) => o.paymentVerified).length;
  const verifyRate = orders.length ? Math.round((verified / orders.length) * 100) : 0;
  const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const uniqueBuyers = new Set(orders.map((o) => o._customerId || o.address?.mobile || o.id)).size;

  const dayMap = {};
  orders.forEach((order) => {
    const key = toInputDate(order.date);
    if (!key) return;
    if (!dayMap[key]) dayMap[key] = { revenue: 0, count: 0 };
    dayMap[key].revenue += Number(order.total || 0);
    dayMap[key].count += 1;
  });
  const dayRows = Object.keys(dayMap).sort().map((key) => ({ label: key, short: key.slice(5), value: dayMap[key].revenue, display: formatCurrencyAmount(dayMap[key].revenue) }));

  const categoryMap = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const cat = item.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(item.price || 0) * Number(item.quantity || 0);
    });
  });
  const categoryRows = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value, display: formatCurrencyAmount(value) }));

  const statusOrder = ['Confirmed', 'Paid', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];
  const statusCounts = {};
  orders.forEach((o) => { const key = o.status || 'Confirmed'; statusCounts[key] = (statusCounts[key] || 0) + 1; });
  const statusRows = statusOrder.filter((s) => statusCounts[s]).map((label) => ({ label, value: statusCounts[label], display: String(statusCounts[label]) }));

  const topProducts = {};
  orders.forEach((order) => { (order.items || []).forEach((item) => { topProducts[item.name] = (topProducts[item.name] || 0) + Number(item.quantity || 0); }); });
  const topList = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value, display: `${value} sold` }));

  const cityMap = {};
  orders.forEach((order) => { const city = order.address?.city || 'Unknown'; cityMap[city] = (cityMap[city] || 0) + Number(order.total || 0); });
  const cityRows = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value, display: formatCurrencyAmount(value) }));

  const lowStock = products.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0).length;
  const outStock = products.filter((p) => Number(p.stock) <= 0).length;
  const catalogValue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
  const buyerCounts = {};
  orders.forEach((o) => { const key = o._customerId || o.address?.mobile || 'guest'; buyerCounts[key] = (buyerCounts[key] || 0) + 1; });
  const repeatBuyers = Object.values(buyerCounts).filter((n) => n > 1).length;
  const repeatRate = uniqueBuyers ? Math.round((repeatBuyers / uniqueBuyers) * 100) : 0;

  const insights = [];
  if (orders.length) {
    insights.push(`AOV is ${formatCurrencyAmount(avgOrder)} across ${orders.length} orders.`);
    insights.push(verifyRate < 70 ? `Only ${verifyRate}% of Razorpay payments are verified — clear the Orders queue.` : `${verifyRate}% of payments are verified. Strong settlement hygiene.`);
    if (categoryRows[0]) insights.push(`${categoryRows[0].label} leads revenue in this window.`);
    if (repeatRate >= 20) insights.push(`${repeatRate}% of buyers ordered more than once — loyalty is building.`);
    if (discountGiven > 0) insights.push(`${formatCurrencyAmount(discountGiven)} given in discounts this period.`);
    if (outStock) insights.push(`${outStock} SKUs are out of stock — refill bestsellers first.`);
  } else {
    insights.push('No orders in this range yet. Try All time or place a test Razorpay order.');
  }

  root.innerHTML = `
    <p class="muted" style="margin:0 0 1rem;">Window: ${from || 'beginning'} → ${to || 'today'} · ${orders.length} of ${allOrders.length} total orders</p>
    <div class="stats-grid" style="margin-bottom:1.5rem;">
      <article class="stat-card"><p class="stat-label">Gross merchandise</p><strong>${formatCurrencyAmount(revenue)}</strong></article>
      <article class="stat-card"><p class="stat-label">Orders</p><strong>${orders.length}</strong></article>
      <article class="stat-card"><p class="stat-label">AOV</p><strong>${formatCurrencyAmount(avgOrder)}</strong></article>
      <article class="stat-card"><p class="stat-label">Items sold</p><strong>${itemsSold}</strong></article>
      <article class="stat-card"><p class="stat-label">Unique buyers</p><strong>${uniqueBuyers}</strong></article>
      <article class="stat-card"><p class="stat-label">Discount given</p><strong>${formatCurrencyAmount(discountGiven)}</strong></article>
      <article class="stat-card"><p class="stat-label">Payment verified</p><strong>${verifyRate}%</strong></article>
      <article class="stat-card"><p class="stat-label">Repeat buyers</p><strong>${repeatRate}%</strong></article>
      <article class="stat-card"><p class="stat-label">Delivered</p><strong>${delivered}</strong></article>
      <article class="stat-card"><p class="stat-label">Cancelled</p><strong>${cancelled}</strong></article>
      <article class="stat-card"><p class="stat-label">Catalog SKUs</p><strong>${products.length}</strong></article>
      <article class="stat-card"><p class="stat-label">Customers</p><strong>${customers.length}</strong></article>
    </div>
    <div class="grid grid-2" style="margin-bottom:1.2rem;">
      <article class="card"><h3 style="margin-top:0;">Revenue by day</h3>${buildBarChart(dayRows)}</article>
      <article class="card"><h3 style="margin-top:0;">Operator insights</h3><ul class="analytics-insights">${insights.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul></article>
    </div>
    <div class="grid grid-2" style="margin-bottom:1.2rem;">
      <article class="card"><h3 style="margin-top:0;">Category revenue mix</h3>${buildProgressRows(categoryRows)}</article>
      <article class="card"><h3 style="margin-top:0;">Fulfillment funnel</h3>${buildProgressRows(statusRows)}</article>
    </div>
    <div class="grid grid-2" style="margin-bottom:1.2rem;">
      <article class="card"><h3 style="margin-top:0;">Top sellers</h3>${buildProgressRows(topList)}</article>
      <article class="card"><h3 style="margin-top:0;">Top cities</h3>${buildProgressRows(cityRows)}</article>
    </div>
    <div class="grid grid-2">
      <article class="card">
        <h3 style="margin-top:0;">Inventory pulse</h3>
        <div class="summary-row"><span>Low stock (≤5)</span><strong>${lowStock}</strong></div>
        <div class="summary-row"><span>Out of stock</span><strong>${outStock}</strong></div>
        <div class="summary-row"><span>Inventory retail value</span><strong>${formatCurrencyAmount(catalogValue)}</strong></div>
        <div class="summary-row"><span>Featured SKUs</span><strong>${products.filter((p) => p.featured).length}</strong></div>
      </article>
      <article class="card">
        <h3 style="margin-top:0;">Payment health</h3>
        <div class="summary-row"><span>Razorpay orders</span><strong>${orders.filter((o) => o.payMethod === 'razorpay').length}</strong></div>
        <div class="summary-row"><span>Verified</span><strong>${verified}</strong></div>
        <div class="summary-row"><span>Awaiting verification</span><strong>${orders.length - verified}</strong></div>
        <div class="summary-row"><span>Verify rate</span><strong>${verifyRate}%</strong></div>
      </article>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply a global fallback for any broken image URL.
  document.addEventListener('error', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallbackApplied === 'true') return;
    target.dataset.fallbackApplied = 'true';
    target.src = DEFAULT_IMAGE_URL;
  }, true);

  initMobileNav();
  renderPublicSiteContent();
  renderUserNav();
  renderPublicCategoryGrid();
  initShopControls();
  renderOfferStrip();
  renderFeaturedProducts();
  renderRecentlyViewedRail();
  renderCompareBar();
  if (document.getElementById('public-products')) {
    renderPublicProducts({ showAll: document.getElementById('public-products').dataset.showAll === 'true' });
  }
  if (document.getElementById('product-detail')) {
    renderProductDetail();
  }
  initCafeMenuFilters();
  renderDealPage();
  updateCartCount();
  initContactForm();
  initNewsletterForm();
  initRevealAnimations();
  initAdmin();
});
