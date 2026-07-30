const STORAGE_KEY = 'bean-bloom-products-v1';
const CATEGORY_STORAGE_KEY = 'bean-bloom-categories-v1';
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80';
const USER_SESSION_KEY = 'bean-bloom-user-session';
const SETTINGS_KEY = 'bean-bloom-site-settings';
const ORDERS_KEY = 'bean-bloom-orders'; // per-user: bean-bloom-orders-{userId}
const ADDRESS_KEY = 'bean-bloom-address'; // per-user: bean-bloom-address-{userId}

const DEFAULT_SETTINGS = {
  siteName: 'Bean & Bloom',
  footerText: '© 2026 Bean & Bloom. Fresh coffee, calm spaces, and warm welcomes.',
  hero: {
    eyebrow: 'A perfect cup, mug, or carafe every time',
    headline: 'Modern coffee products with premium style and effortless performance.',
    subtext: 'Discover expertly curated roasts, elegant brewing gear, and premium accessories designed for coffee lovers and modern kitchens.',
    cta1Label: 'Shop products', cta1Url: '#products',
    cta2Label: 'Explore more', cta2Url: 'about.html',
    tile1Badge: 'Best Seller', tile1Title: 'Canberra Coffee', tile1Desc: 'Bright, balanced, and roasted to perfection.',
    tile2Badge: 'Featured', tile2Title: 'Commercial Coffee', tile2Desc: 'Rich and smooth for every morning ritual.'
  },
  categorySection: { title: 'Shop by category', subtext: 'Explore the coffee machines, accessories, and premium beans that define our collection.' },
  featuredSection: { title: 'Featured products', subtext: 'Highlighted selections from the admin-managed collection.' },
  deal: {
    eyebrow: 'Deal of the day', title: 'Keurig® K15 Classic Series',
    description: 'Compact, convenient, and built for modern kitchens. Elevate your daily coffee ritual with this premium machine.',
    price: '$99.99', badge: 'Limited time offer', ctaLabel: 'View deal', ctaUrl: '#products', imageUrl: ''
  },
  testimonials: [
    {
      quote: 'The product selection is refined, and the delivery was effortless.',
      author: 'Aarav Mehta, Designer',
      avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      quote: 'A beautifully designed storefront with excellent products and support.',
      author: 'Ishita Sharma, Founder',
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      quote: 'High-quality gear and premium coffee — exactly what I was looking for.',
      author: 'Rohan Verma, Consultant',
      avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  ],
  promoStrip: [
    { title: 'Free shipping', desc: 'On orders over $100' },
    { title: 'Secure checkout', desc: 'Trusted payment every time' },
    { title: 'Premium support', desc: 'Here to help with every order' },
    { title: 'Quality guarantee', desc: 'Expertly curated product range' }
  ],
  payments: {
    codEnabled: true,
    upiEnabled: true,
    upiId: 'beanbloom@upi',
    razorpayEnabled: false,
    razorpayKeyId: ''
  }
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (!saved) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    // Deep merge to add any new keys from DEFAULT_SETTINGS
    return {
      ...DEFAULT_SETTINGS, ...saved,
      hero: { ...DEFAULT_SETTINGS.hero, ...(saved.hero || {}) },
      categorySection: { ...DEFAULT_SETTINGS.categorySection, ...(saved.categorySection || {}) },
      featuredSection: { ...DEFAULT_SETTINGS.featuredSection, ...(saved.featuredSection || {}) },
      deal: { ...DEFAULT_SETTINGS.deal, ...(saved.deal || {}) },
      testimonials: Array.isArray(saved.testimonials)
        ? saved.testimonials.map((item, index) => ({
            ...DEFAULT_SETTINGS.testimonials[index % DEFAULT_SETTINGS.testimonials.length],
            ...(item || {})
          }))
        : DEFAULT_SETTINGS.testimonials,
      promoStrip: saved.promoStrip || DEFAULT_SETTINGS.promoStrip,
      payments: { ...DEFAULT_SETTINGS.payments, ...(saved.payments || {}) }
    };
  } catch { return JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Sets text/href/src of element by id if it exists
function setEl(id, value, attr = 'text') {
  const el = document.getElementById(id);
  if (!el) return;
  if (attr === 'text') el.textContent = value;
  else if (attr === 'html') el.innerHTML = value;
  else el.setAttribute(attr, value);
}

function renderPublicSiteContent() {
  const s = loadSettings();

  // Brand name
  document.querySelectorAll('.brand').forEach(el => { if (el.closest('.site-header')) el.textContent = s.siteName; });
  document.querySelectorAll('.brand-name').forEach(el => { el.textContent = s.siteName; });

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

  // Featured section headings
  setEl('featured-section-title', s.featuredSection.title);
  setEl('featured-section-sub', s.featuredSection.subtext);

  // Deal of the day
  setEl('deal-eyebrow', s.deal.eyebrow);
  setEl('deal-title', s.deal.title);
  setEl('deal-desc', s.deal.description);
  setEl('deal-price', s.deal.price);
  setEl('deal-badge', s.deal.badge);
  const dealCta = document.getElementById('deal-cta');
  if (dealCta) { dealCta.textContent = s.deal.ctaLabel; dealCta.href = s.deal.ctaUrl; }
  const dealImg = document.getElementById('deal-image');
  if (dealImg) dealImg.style.backgroundImage = s.deal.imageUrl ? `url('${escapeHtml(s.deal.imageUrl)}')` : '';

  // Testimonials
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = s.testimonials.map((t, i) => `
      <article class="card testimonial-card">
        <p>"${escapeHtml(t.quote)}"</p>
        <div class="testimonial-person">
          <img class="testimonial-avatar" src="${escapeHtml(t.avatarUrl || DEFAULT_SETTINGS.testimonials[i % DEFAULT_SETTINGS.testimonials.length].avatarUrl)}" alt="${escapeHtml(t.author)}" loading="lazy">
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

  // Footer
  document.querySelectorAll('.site-footer p').forEach(el => el.textContent = s.footerText);
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
  'Merchandise'
];

const seedCatalog = {
  'Espresso': [
    { name: 'Signature Espresso', price: 4.5, description: 'Bold and velvety with caramel notes.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
    { name: 'Double Ristretto', price: 4.9, description: 'Short pull espresso with intense aroma and sweetness.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Hazelnut Espresso', price: 5.1, description: 'Nutty and smooth espresso with toasted hazelnut notes.', imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' },
    { name: 'Vanilla Bean Shot', price: 4.8, description: 'Classic espresso balanced with warm vanilla flavor.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Midnight Espresso', price: 5.3, description: 'Dark roast profile with cocoa finish and rich crema.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' }
  ],
  'Espresso Gear': [
    { name: 'Precision Tamper', price: 39.99, description: 'Balanced stainless-steel tamper for even extraction.', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80' },
    { name: 'Milk Frothing Pitcher', price: 24.5, description: 'Barista pitcher with sharp spout for latte art.', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bottomless Portafilter', price: 54.0, description: 'Improve shot diagnostics with a naked portafilter.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Knock Box Pro', price: 29.99, description: 'Compact puck knock box with anti-slip base.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'Distribution Tool', price: 34.75, description: 'Level and distribute grounds for consistent shots.', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80' }
  ],
  'Beans & Blends': [
    { name: 'Golden Morning Brew', price: 18.0, description: 'Bright floral single-origin roast for daily brewing.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Monsoon Malabar Blend', price: 19.5, description: 'Earthy Indian blend with low acidity and heavy body.', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=900&q=80' },
    { name: 'Coastal House Blend', price: 17.5, description: 'Balanced medium roast ideal for drip and French press.', imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Dark Cocoa Roast', price: 20.0, description: 'Deep chocolate profile with smoky undertones.', imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80' },
    { name: 'Weekend Brunch Blend', price: 16.99, description: 'Smooth and mellow crowd favorite for long mornings.', imageUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=900&q=80' }
  ],
  'Coffee Machines': [
    { name: 'AeroPress Coffee Maker', price: 89.99, description: 'Compact brewer for smooth coffee at home.', imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80' },
    { name: 'SteamPro Espresso Machine', price: 349.0, description: 'Semi-automatic machine with integrated pressure gauge.', imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80' },
    { name: 'BeanMaster Grinder Combo', price: 279.5, description: 'All-in-one brewer and burr grinder combo.', imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80' },
    { name: 'K15 Compact Brewer', price: 129.99, description: 'Single-serve compact machine for fast brewing.', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80' },
    { name: 'Classic French Press Set', price: 69.0, description: 'Thermal press setup for robust and full-bodied cups.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' }
  ],
  'Barista Tools': [
    { name: 'Barista Tool Kit', price: 49.99, description: 'Essential accessories for espresso and milk prep.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
    { name: 'Latte Art Pen Set', price: 19.99, description: 'Creative pen set for latte art details.', imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80' },
    { name: 'Scale and Timer Duo', price: 42.0, description: 'Precision scale with brew timer for repeatable recipes.', imageUrl: 'https://images.unsplash.com/photo-1521302080391-cb77d1d9159a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cleaning Brush Pack', price: 14.99, description: 'Multi-size brushes for machine and grinder upkeep.', imageUrl: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Shot Glass Duo', price: 16.5, description: 'Dual espresso measuring glasses with markings.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' }
  ],
  'Cold Brew': [
    { name: 'Classic Cold Brew Bottle', price: 22.0, description: 'Easy steep bottle for smooth overnight brew.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1f0d5?auto=format&fit=crop&w=900&q=80' },
    { name: 'Nitro Chill Concentrate', price: 15.99, description: 'Rich cold brew concentrate for milk-based drinks.', imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80' },
    { name: 'Citrus Cold Brew Blend', price: 17.25, description: 'Bright blend tuned for cold extraction.', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cold Brew Filter Pack', price: 11.5, description: 'Disposable filters for clean and quick prep.', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80' },
    { name: 'Iced Coffee Starter Kit', price: 34.0, description: 'Starter bundle for cafe-style iced coffee at home.', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80' }
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
    { name: 'Sticker Pack', price: 6.5, description: 'Set of waterproof coffee-themed stickers.', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' }
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
    featured: index === 0,
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
  'Merchandise': 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80'
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
    longDescription: String(product?.longDescription || '').trim() || buildDefaultLongDescription(product)
  };
}

function normalizeProductList(products) {
  return (Array.isArray(products) ? products : []).map(normalizeProduct);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
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
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = mergeSeedProducts(parsed);
      const normalized = normalizeProductList(merged);
      if (normalized.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    }
  } catch (e) {
    console.warn('Unable to load products', e);
  }
  const normalizedDefaults = normalizeProductList(defaultProducts);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedDefaults));
  return normalizedDefaults;
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProductList(products)));
}

function loadCategories() {
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
      return merged;
    }
  } catch (e) {
    console.warn('Unable to load categories', e);
  }
  const categories = Array.from(new Set([...defaultCategories, ...fromProducts]));
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  return categories;
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
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
          <span>Seller: Bean & Bloom</span>
          <span>Delivery in 2 days</span>
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
        <strong>$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
      </div>
    `;
    fragment.appendChild(row);
  });

  cartItemsRoot.appendChild(fragment);

  // ✨ Using totalValue from database instead of calculating locally
  const total = cartData.totalValue;
  const totalItems = cartData.itemCount;
  const discount = total * 0.08;
  const coupon = 5;
  const platformFee = 0;
  const totalAmount = total - discount - coupon + platformFee;

  cartSummary.innerHTML = `
    <div class="cart-summary-box">
      <h3>Price details</h3>
      <div class="summary-row"><span>Price (${totalItems} items)</span><span>$${total.toFixed(2)}</span></div>
      <div class="summary-row"><span>Discount</span><span>− $${discount.toFixed(2)}</span></div>
      <div class="summary-row"><span>Coupons for you</span><span>− $${coupon.toFixed(2)}</span></div>
      <div class="summary-row"><span>Platform fee</span><span>$${platformFee.toFixed(2)}</span></div>
      <div class="summary-total"><span>Total amount</span><span>$${totalAmount.toFixed(2)}</span></div>
      <button class="btn place-order" id="checkout-button" type="button">Place order</button>
      <button class="btn secondary" id="clear-cart" type="button">Clear cart</button>
      <p class="summary-note">You will save $${(discount + coupon).toFixed(2)} on this order.</p>
      <p class="summary-subnote">Safe and secure payments. Easy returns. 100% authentic products.</p>
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
      <img class="product-image" src="${escapeHtml(item.imageUrl || DEFAULT_IMAGE_URL)}" alt="${escapeHtml(item.name)}">
      <div class="cart-item-details">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${escapeHtml(item.category || 'Coffee')}</p>
        <div class="cart-item-meta">
          <span>Seller: Bean & Bloom</span>
          <span>Delivery in 2 days</span>
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
        <strong>$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
      </div>
    `;
    fragment.appendChild(row);
  });

  cartItemsRoot.appendChild(fragment);

  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const discount = total * 0.08;
  const coupon = 5;
  const platformFee = 0;
  const totalAmount = total - discount - coupon + platformFee;

  cartSummary.innerHTML = `
    <div class="cart-summary-box">
      <h3>Price details</h3>
      <div class="summary-row"><span>Price (${totalItems} items)</span><span>$${total.toFixed(2)}</span></div>
      <div class="summary-row"><span>Discount</span><span>− $${discount.toFixed(2)}</span></div>
      <div class="summary-row"><span>Coupons for you</span><span>− $${coupon.toFixed(2)}</span></div>
      <div class="summary-row"><span>Platform fee</span><span>$${platformFee.toFixed(2)}</span></div>
      <div class="summary-total"><span>Total amount</span><span>$${totalAmount.toFixed(2)}</span></div>
      <button class="btn place-order" id="checkout-button" type="button">Place order</button>
      <button class="btn secondary" id="clear-cart" type="button">Clear cart</button>
      <p class="summary-note">You will save $${(discount + coupon).toFixed(2)} on this order.</p>
      <p class="summary-subnote">Safe and secure payments. Easy returns. 100% authentic products.</p>
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
  
  categories.forEach(category => {
    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-card';
    categoryLink.href = `category.html?category=${encodeURIComponent(category.toLowerCase())}`;
    categoryLink.dataset.category = category.toLowerCase();
    
    // Get custom image if it exists
    const categoryImages = JSON.parse(localStorage.getItem('bean-bloom-category-images') || '{}');
    const customImage = categoryImages[category];
    const categoryProduct = products.find((item) => String(item.category || '').toLowerCase() === category.toLowerCase() && item.imageUrl);
    const mappedFallback = categoryFallbackImages[category];
    const defaultImage = mappedFallback || 'https://images.unsplash.com/photo-1447933601403-0c6688b33a69?auto=format&fit=crop&w=900&q=80';
    const hasValidCustomImage = /^https?:\/\//i.test(String(customImage || '').trim());
    const hasValidProductImage = /^https?:\/\//i.test(String(categoryProduct?.imageUrl || '').trim());
    
    // Always set a known fallback first, then upgrade if external image URL actually loads.
    categoryLink.style.setProperty('--category-image', `url('${escapeHtml(defaultImage)}')`);

    const preferredUrl = hasValidCustomImage
      ? String(customImage).trim()
      : (hasValidProductImage ? String(categoryProduct.imageUrl).trim() : '');

    if (preferredUrl) {
      const probe = new Image();
      probe.onload = () => {
        categoryLink.style.setProperty('--category-image', `url('${escapeHtml(preferredUrl)}')`);
      };
      probe.onerror = () => {
        categoryLink.style.setProperty('--category-image', `url('${escapeHtml(defaultImage)}')`);
      };
      probe.src = preferredUrl;
    }

    categoryLink.innerHTML = `
      <div class="category-card-overlay"></div>
      <h3>${escapeHtml(category)}</h3>
    `;
    root.appendChild(categoryLink);
  });
}

function renderPublicProducts(options = {}) {
  const root = document.getElementById('public-products');
  if (!root) return;
  const showAll = options.showAll || false;
  let products = loadProducts();
  if (!showAll) products = products.filter(p => p.featured !== false);
  const categoryFilter = options.categoryFilter || getCategoryFilter();

  if (categoryFilter) {
    products = products.filter((product) => matchesCategory(product.category, categoryFilter));
  }

  root.innerHTML = '';

  if (!products.length) {
    root.innerHTML = '<div class="card"><p class="muted">No products yet. Add one from the admin panel.</p></div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach(product => {
    const imageSrc = product.imageUrl ? escapeHtml(product.imageUrl) : DEFAULT_IMAGE_URL;
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.innerHTML = `
      <img class="product-image" src="${imageSrc}" alt="${escapeHtml(product.name)}">
      <span class="badge">${escapeHtml(product.category || 'Coffee')}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <p class="muted">${escapeHtml(product.description || 'Freshly made with care.')}</p>
      <div class="product-meta">
        <div class="price">$${Number(product.price).toFixed(2)}</div>
        <div class="product-actions">
          <button class="btn secondary add-to-kart" type="button" data-buy="${product.id}">Add to cart</button>
        </div>
      </div>
    `;
    const addButton = card.querySelector('.add-to-kart');
    if (addButton) {
      addButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const added = addToCart(product.id);
        if (added) alert(`${product.name} has been added to your cart.`);
      });
    }

    card.addEventListener('click', (event) => {
      if (event.target.closest('.add-to-kart')) return;
      window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
    });
    fragment.appendChild(card);
  });
  root.appendChild(fragment);
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

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length
    ? product.imageUrls
    : [product.imageUrl || DEFAULT_IMAGE_URL];
  const currentUser = getLoggedInUser();

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
            <span class="price">$${Number(product.price).toFixed(2)}</span>
            <button class="btn" id="buy-button" type="button">Add to cart</button>
          </div>
          <div class="product-detail-panel">
            <h3>Product details</h3>
            <p class="product-detail-note">${escapeHtml(product.longDescription || product.description || 'Enjoy fast shipping, secure checkout, and premium customer support with every order.')}</p>
          </div>
        </div>
      </div>

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
      if (added) alert(`${product.name} has been added to your cart.`);
    });
  }

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
  const adminPageType = document.body.dataset.adminPage || 'dashboard';
  const isDashboardPage = adminPageType === 'dashboard';
  const pageCategory = new URLSearchParams(window.location.search).get('category') || '';

  const loginForm = document.getElementById('login-form');
  const adminPanel = document.getElementById('admin-panel');
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

  // Guard clause: require core elements that exist on all admin pages
  if (!loginForm || !adminPanel) return;
  
  // For dashboard page, also require product management elements
  if (isDashboardPage && (!form || !productList || !categorySelect || !selectedCategoryName || !productPanel || !productFormContainer || !showAddProductBtn)) return;

  function showPanel(visible) {
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
        card.href = `admin-category.html?category=${encodeURIComponent(category)}`;
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
    if (selectedCategory) {
      selectedCategoryName.textContent = selectedCategory;
      productPanel.classList.remove('hide');
      statusBox.textContent = `Showing products in "${selectedCategory}".`;
    } else {
      selectedCategoryName.textContent = '';
      productPanel.classList.add('hide');
      statusBox.textContent = 'Select a category to manage products.';
    }
    renderAdminCategoryGrid(selectedCategory);
    renderAdminProducts();
  }

  function showProductForm(title = 'Add product') {
    document.getElementById('product-form-title').textContent = title;
    productFormContainer.classList.remove('hide');
    categorySelect.value = selectedCategory || '';
    newCategoryInput.value = '';
    document.getElementById('name').focus();
  }

  function hideProductForm() {
    productFormContainer.classList.add('hide');
    form.reset();
    editingIdInput.value = '';
  }

  const isLoggedIn = sessionStorage.getItem('bean-bloom-admin') === 'true';
  showPanel(isLoggedIn);

  // Category page specific functions
  if (!isDashboardPage) {
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
            <div class="price" style="margin: 0.8rem 0;">$${Number(product.price).toFixed(2)}</div>
            ${product.featured ? '<div class="badge" style="background: var(--accent); color: white;">Featured</div>' : ''}
            <div class="inline-actions" style="margin-top: 0.8rem;">
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
        const products = loadProducts();

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
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('bean-bloom-admin', 'true');
      showPanel(true);
      if (isDashboardPage) {
        selectCategory(null);
        renderCategoryOptions();
        renderAdminCategoryGrid(null);
      } else {
        selectCategory(pageCategory || loadCategories()[0] || null);
        renderCategoryOptions(selectedCategory);
      }
      renderAdminProducts();
      renderAdminMetrics();
      if (statusBox) statusBox.textContent = 'Admin access granted.';
    } else {
      if (statusBox) statusBox.textContent = 'Use admin / admin to enter the dashboard.';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('bean-bloom-admin');
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
    const categories = loadCategories();
    const products = loadProducts();
    const featuredCount = products.filter((product) => product.featured).length;
    const cartItems = getCartCount();
    const cartTotal = loadCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    const averagePrice = products.length ? products.reduce((sum, item) => sum + Number(item.price || 0), 0) / products.length : 0;

    const categoriesEl = document.getElementById('metric-categories');
    const productsEl = document.getElementById('metric-products');
    const featuredEl = document.getElementById('metric-featured');
    const cartEl = document.getElementById('metric-cart');
    const cartValueEl = document.getElementById('metric-cart-value');
    const avgPriceEl = document.getElementById('metric-average-price');

    if (categoriesEl) categoriesEl.textContent = categories.length;
    if (productsEl) productsEl.textContent = products.length;
    if (featuredEl) featuredEl.textContent = featuredCount;
    if (cartEl) cartEl.textContent = cartItems;
    if (cartValueEl) cartValueEl.textContent = `$${cartTotal.toFixed(2)}`;
    if (avgPriceEl) avgPriceEl.textContent = `$${averagePrice.toFixed(2)}`;
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
        <div class="price">$${Number(product.price).toFixed(2)}</div>
        <div class="inline-actions">
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
      statusBox.textContent = 'Enter a category name.';
      return false;
    }
    const categories = loadCategories();
    if (categories.some(item => item.toLowerCase() === categoryName.toLowerCase())) {
      statusBox.textContent = 'Category already exists.';
      return false;
    }
    categories.unshift(categoryName);
    saveCategories(categories);
    renderCategoryOptions(categoryName);
    renderAdminCategoryGrid(selectedCategory);
    statusBox.textContent = 'Category added.';
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

  // Only render these on dashboard page where elements exist
  if (isDashboardPage) {
    renderCategoryOptions();
    renderAdminCategoryGrid(selectedCategory);
    renderAdminProducts();
  } else {
    // On other pages like categories, just render the category grid
    renderAdminCategoryGrid(selectedCategory);
  }

  if (productList) {
    productList.addEventListener('click', (event) => {
      const editId = event.target.getAttribute('data-edit');
      const deleteId = event.target.getAttribute('data-delete');
      const products = loadProducts();
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
          <a href="account.html" style="font-weight:700;color:var(--accent);">Hi, ${escapeHtml(firstName)}</a>
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
  const status = document.getElementById('contact-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = String(nameInput?.value || '').trim();
    const email = String(emailInput?.value || '').trim();
    const message = String(messageInput?.value || '').trim();

    if (!name || !email || !message) {
      if (status) status.textContent = 'Please fill in name, email, and message.';
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = 'Sending your enquiry...';

    try {
      const response = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
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
    } catch (error) {
      if (status) status.textContent = 'Unable to send enquiry right now. Please ensure backend API is running on localhost:3001.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

async function renderAdminInquiries() {
  const root = document.getElementById('admin-inquiries-list');
  if (!root) return;

  root.innerHTML = '<p class="muted">Loading enquiries...</p>';
  try {
    const response = await fetch(`${API_BASE}/inquiries`);
    if (!response.ok) throw new Error('Failed to load enquiries.');

    const inquiries = await response.json();
    if (!Array.isArray(inquiries) || !inquiries.length) {
      root.innerHTML = '<p class="muted">No enquiries yet.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    inquiries.forEach((inquiry) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h4 style="margin:.2rem 0 .35rem;">${escapeHtml(inquiry.name || 'Customer')}</h4>
        <p class="muted" style="margin:0;">${escapeHtml(inquiry.email || '')}</p>
        <p style="margin:.85rem 0 .6rem;">${escapeHtml(inquiry.message || '')}</p>
        <p class="muted" style="margin:0;font-size:.85rem;">${new Date(inquiry.created_at).toLocaleString()}</p>
      `;
      fragment.appendChild(card);
    });

    root.innerHTML = '';
    root.appendChild(fragment);
  } catch (error) {
    root.innerHTML = '<p class="muted">Unable to load enquiries. Please ensure backend API is running on localhost:3001.</p>';
  }
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

  renderPublicSiteContent();
  renderUserNav();
  renderPublicCategoryGrid();
  if (document.getElementById('public-products')) {
    renderPublicProducts();
  }
  if (document.getElementById('product-detail')) {
    renderProductDetail();
  }
  updateCartCount();
  initContactForm();
  renderAdminInquiries();
  initAdmin();
});
