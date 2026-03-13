const PRODUCTS = [
  { id:1, name:'Baby Spinach', category:'vegetable', emoji:'🥬', price:49, desc:'Tender leaves, pesticide-free', badge:'Best Seller' },
  { id:2, name:'Red Tomatoes', category:'vegetable', emoji:'🍅', price:39, desc:'Vine-ripened, full of lycopene', badge:null },
  { id:3, name:'Broccoli Crown', category:'vegetable', emoji:'🥦', price:79, desc:'Rich in vitamins K & C', badge:'New' },
  { id:4, name:'Alphonso Mango', category:'fruit', emoji:'🥭', price:149, desc:'King of mangoes, naturally sweet', badge:'Seasonal' },
  { id:5, name:'Fuji Apple', category:'fruit', emoji:'🍎', price:89, desc:'Crisp, sweet & freshly harvested', badge:null },
  { id:6, name:'Banana Bunch', category:'fruit', emoji:'🍌', price:29, desc:'Naturally ripened, energy-rich', badge:null },
  { id:7, name:'Brown Rice', category:'grain', emoji:'🌾', price:99, desc:'Whole grain, fibre-packed', badge:'Organic' },
  { id:8, name:'Rolled Oats', category:'grain', emoji:'🌿', price:119, desc:'Gluten-free certified, slow-release', badge:null },
  { id:9, name:'A2 Cow Milk', category:'dairy', emoji:'🥛', price:69, desc:'Fresh from desi cows, no additives', badge:'Farm Fresh' },
  { id:10, name:'Greek Yogurt', category:'dairy', emoji:'🫙', price:89, desc:'Probiotic-rich, thick & creamy', badge:null },
  { id:11, name:'Tulsi Leaves', category:'herb', emoji:'🌿', price:19, desc:'Sacred basil, immunity booster', badge:null },
  { id:12, name:'Ginger Root', category:'herb', emoji:'🫚', price:34, desc:'Fresh & pungent, anti-inflammatory', badge:'Hot Pick' },
];

const TESTIMONIALS = [
  { text: 'The freshness is unbelievable. My family switched entirely to GreenHarvest — the spinach stays fresh for days!', author: 'Priya S.', loc: 'Hyderabad', stars: 5, emoji: '🌸' },
  { text: 'Finally an organic store that actually delivers what it promises. The A2 milk is life-changing for my kids.', author: 'Rahul M.', loc: 'Bangalore', stars: 5, emoji: '🌱' },
  { text: 'Gorgeous packaging, super fast delivery. The mangoes were absolutely divine. Will reorder every season!', author: 'Ananya K.', loc: 'Chennai', stars: 5, emoji: '🍃' },
];

/* ============================================================
   CART STATE
============================================================ */
let cart = {};

/* ============================================================
   RENDER PRODUCTS
============================================================ */
function renderProducts(filter = 'all', search = '') {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('no-results');
  const searchTerm = document.getElementById('searchTerm');
  grid.innerHTML = '';

  const filtered = PRODUCTS.filter(p => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    noResults.style.display = 'block';
    searchTerm.textContent = search;
  } else {
    noResults.style.display = 'none';
    filtered.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.animationDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="product-img">
          ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
          <span style="font-size:4rem">${p.emoji}</span>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-footer">
            <div class="product-price">₹${p.price}</div>
            <button class="add-btn" onclick="addToCart(${p.id})" title="Add to cart">+</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }
}

/* ============================================================
   FILTER & SEARCH
============================================================ */
let currentFilter = 'all';

function filterProducts(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(currentFilter, document.getElementById('searchInput').value);
}

function searchProduct() {
  renderProducts(currentFilter, document.getElementById('searchInput').value);
}

/* ============================================================
   CART LOGIC
============================================================ */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  cart[id] = cart[id] ? { ...cart[id], qty: cart[id].qty + 1 } : { ...product, qty: 1 };
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to basket!`);
  bumpCartCount();
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cart-count').textContent = count;

  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  document.getElementById('cartTotal').textContent = `₹${total}`;

  if (items.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty"><span>🌿</span>Your basket is empty.<br>Add some organic goodness!</div>`;
    cartFooter.style.display = 'none';
  } else {
    cartFooter.style.display = 'block';
    cartItemsEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑</button>
      </div>`).join('');
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function proceedCheckout() {
  const items = Object.values(cart);
  if (items.length === 0) {
    showToast('🛒 Your cart is empty!');
    return;
  }
  showToast('✅ Redirecting to checkout…');
  // Navigate to checkout.html in real app
  setTimeout(() => alert(`Order Summary:\n\n${items.map(i=>`${i.emoji} ${i.name} × ${i.qty} = ₹${i.price*i.qty}`).join('\n')}\n\nTotal: ₹${items.reduce((s,i)=>s+i.price*i.qty,0)}\n\nThank you for choosing GreenHarvest! 🌿`), 600);
}

function bumpCartCount() {
  const el = document.getElementById('cart-count');
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

/* ============================================================
   TOAST
============================================================ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ============================================================
   THEME
============================================================ */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}

/* ============================================================
   FLOATING LEAVES (HERO)
============================================================ */
function spawnLeaves() {
  const container = document.getElementById('heroLeaves');
  const leafEmojis = ['🍃','🌿','🌱','🍀','🌾'];
  for (let i = 0; i < 14; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.animationDuration = (8 + Math.random() * 10) + 's';
    leaf.style.animationDelay = (Math.random() * 12) + 's';
    leaf.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
    container.appendChild(leaf);
  }
}

/* ============================================================
   TESTIMONIALS
============================================================ */
function renderTestimonials() {
  const el = document.getElementById('testimonials');
  el.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="stars">${'⭐'.repeat(t.stars)}</div>
      <div class="testimonial-text">"${t.text}"</div>
      <div class="testimonial-author">
        <div class="author-avatar">${t.emoji}</div>
        <div>
          <div class="author-name">${t.author}</div>
          <div class="author-loc">📍 ${t.loc}</div>
        </div>
      </div>
    </div>`).join('');
}

/* ============================================================
   NEWSLETTER
============================================================ */
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email!');
    return;
  }
  document.getElementById('newsletterEmail').value = '';
  showToast(`🌿 Welcome to the Green Circle, ${email.split('@')[0]}!`);
}

/* ============================================================
   VIDEO: hide placeholder if video loads
============================================================ */
function initVideo() {
  const video = document.querySelector('.video-wrap video');
  const placeholder = document.getElementById('videoPlaceholder');
  if (video && video.currentSrc && video.currentSrc !== window.location.href) {
    placeholder.style.display = 'none';
    video.style.display = 'block';
  } else {
    video.style.display = 'none';
  }
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.testimonial-card, .product-card, .audio-player, .video-wrap').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderTestimonials();
  spawnLeaves();
  initVideo();
  setTimeout(initScrollReveal, 100);
});