/* ============================================
   AGHARBI PARFUM - Main Application JS
   ============================================ */

// ---- Default Products Data ----
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name_fr: "Oud Royal",
    name_ar: "عود ملكي",
    category: "homme",
    price: 450,
    image: "images/perfume-men-1.jpg",
    description_fr: "Un parfum masculin intense aux notes de oud, ambre et bois de santal. Une fragrance royale pour l'homme d'exception.",
    description_ar: "عطر رجالي مكثف بنفحات العود والعنبر وخشب الصندل. عطر ملكي للرجل الاستثنائي.",
    sizes: ["50ml", "100ml", "150ml"],
    badge: "bestseller",
    badge_fr: "Best-seller",
    badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 2,
    name_fr: "Rose d'Orient",
    name_ar: "وردة الشرق",
    category: "femme",
    price: 380,
    image: "images/perfume-women-1.jpg",
    description_fr: "Une fragrance féminine envoûtante aux notes de rose de Damas, jasmin et musc blanc. Élégance pure.",
    description_ar: "عطر نسائي ساحر بنفحات وردة دمشق والياسمين والمسك الأبيض. أناقة خالصة.",
    sizes: ["50ml", "100ml"],
    badge: "nouveau",
    badge_fr: "Nouveau",
    badge_ar: "جديد"
  },
  {
    id: 3,
    name_fr: "Nuit Dorée",
    name_ar: "الليلة الذهبية",
    category: "homme",
    price: 520,
    image: "images/perfume-men-2.jpg",
    description_fr: "Un parfum sophistiqué aux notes de cuir, tabac et vanille. Pour les soirées les plus élégantes.",
    description_ar: "عطر راقي بنفحات الجلد والتبغ والفانيليا. للأمسيات الأكثر أناقة.",
    sizes: ["50ml", "100ml", "150ml"],
    badge: "bestseller",
    badge_fr: "Best-seller",
    badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 4,
    name_fr: "Fleur de Lune",
    name_ar: "زهرة القمر",
    category: "femme",
    price: 420,
    image: "images/perfume-women-2.jpg",
    description_fr: "Un bouquet floral délicat aux notes de pivoine, iris et bois de cèdre. Romantique et inoubliable.",
    description_ar: "باقة زهرية رقيقة بنفحات الفاوانيا والسوسن وخشب الأرز. رومانسي ولا يُنسى.",
    sizes: ["50ml", "100ml"],
    badge: "",
    badge_fr: "",
    badge_ar: ""
  },
  {
    id: 5,
    name_fr: "Ambre Mystique",
    name_ar: "عنبر صوفي",
    category: "homme",
    price: 490,
    image: "images/perfume-unisex-1.jpg",
    description_fr: "Un parfum oriental mystérieux aux notes d'ambre, encens et patchouli. Profond et envoûtant.",
    description_ar: "عطر شرقي غامض بنفحات العنبر والبخور والباتشولي. عميق وساحر.",
    sizes: ["50ml", "100ml", "150ml"],
    badge: "nouveau",
    badge_fr: "Nouveau",
    badge_ar: "جديد"
  },
  {
    id: 6,
    name_fr: "Jasmin Noir",
    name_ar: "ياسمين أسود",
    category: "femme",
    price: 350,
    image: "images/perfume-women-1.jpg",
    description_fr: "Un parfum captivant aux notes de jasmin noir, vanille et bois précieux. Mystérieux et séduisant.",
    description_ar: "عطر آسر بنفحات الياسمين الأسود والفانيليا والأخشاب الثمينة. غامض ومغري.",
    sizes: ["50ml", "100ml"],
    badge: "bestseller",
    badge_fr: "Best-seller",
    badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 7,
    name_fr: "Bois Précieux",
    name_ar: "أخشاب ثمينة",
    category: "homme",
    price: 560,
    image: "images/perfume-men-1.jpg",
    description_fr: "Un accord boisé raffiné aux notes de bois de agar, cèdre et vétiver. Noblesse masculine.",
    description_ar: "تناغم خشبي راقي بنفحات خشب العقر والأرز والفيتيفر. نبل ذكوري.",
    sizes: ["50ml", "100ml", "150ml"],
    badge: "",
    badge_fr: "",
    badge_ar: ""
  },
  {
    id: 8,
    name_fr: "Essence de Musc",
    name_ar: "خلاصة المسك",
    category: "femme",
    price: 390,
    image: "images/perfume-women-2.jpg",
    description_fr: "Un parfum sensuel aux notes de musc blanc, fleur d'oranger et ambre doré. Douceur orientale.",
    description_ar: "عطر حسي بنفحات المسك الأبيض وزهر البرتقال والعنبر الذهبي. نعومة شرقية.",
    sizes: ["50ml", "100ml"],
    badge: "nouveau",
    badge_fr: "Nouveau",
    badge_ar: "جديد"
  }
];

// ---- State ----
let currentLang = 'fr';
let products = [];
let cart = [];
let currentFilter = 'all';
let modalProduct = null;
let modalQty = 1;

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  initNavbar();
  initScrollEffects();
  initLanguage();
  renderProducts();
  updateCartUI();

  // Hide loader
  setTimeout(() => {
    document.getElementById('pageLoader').classList.add('hidden');
  }, 1200);
});

// ---- Products Management ----
function loadProducts() {
  const saved = localStorage.getItem('agharbi_products');
  if (saved) {
    try {
      products = JSON.parse(saved);
    } catch (e) {
      products = [...DEFAULT_PRODUCTS];
    }
  } else {
    products = [...DEFAULT_PRODUCTS];
  }
}

function saveProducts() {
  localStorage.setItem('agharbi_products', JSON.stringify(products));
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = currentFilter === 'all' 
    ? products 
    : products.filter(p => p.category === currentFilter || p.badge === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:60px 20px; color: var(--color-white-muted);">
        <i class="fas fa-search" style="font-size:2rem; margin-bottom:12px; display:block; color:var(--color-dark-border);"></i>
        <p>${currentLang === 'fr' ? 'Aucun produit trouvé' : 'لم يتم العثور على منتجات'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((product, index) => {
    const name = currentLang === 'ar' ? product.name_ar : product.name_fr;
    const desc = currentLang === 'ar' ? product.description_ar : product.description_fr;
    const catLabel = currentLang === 'ar' 
      ? (product.category === 'homme' ? 'رجالي' : 'نسائي') 
      : (product.category === 'homme' ? 'Pour Homme' : 'Pour Femme');
    const badgeLabel = currentLang === 'ar' ? product.badge_ar : product.badge_fr;

    return `
      <div class="product-card fade-in-up" style="animation-delay: ${index * 0.1}s" data-id="${product.id}">
        ${badgeLabel ? `<span class="product-badge">${badgeLabel}</span>` : ''}
        <div class="image-container" onclick="openProductModal(${product.id})">
          <img src="${product.image}" alt="${name}" loading="lazy">
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(this)" aria-label="Wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${catLabel}</span>
          <h3 class="product-name" onclick="openProductModal(${product.id})">${name}</h3>
          <p class="product-description">${desc}</p>
          <div class="product-footer">
            <span class="product-price">${product.price} <span class="currency">MAD</span></span>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
              <i class="fas fa-plus"></i> <span>${currentLang === 'fr' ? 'Ajouter' : 'أضف'}</span>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  // Trigger fade-in
  setTimeout(() => {
    document.querySelectorAll('.product-card.fade-in-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
}

// ---- Filter Products ----
function filterProducts(filter) {
  currentFilter = filter;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  renderProducts();

  // Scroll to products
  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Filter button clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    filterProducts(e.target.dataset.filter);
  }
});

// ---- Wishlist ----
function toggleWishlist(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('liked')) {
    icon.classList.replace('far', 'fas');
    showToast(currentLang === 'fr' ? 'Ajouté aux favoris ♥' : 'تمت الإضافة للمفضلة ♥');
  } else {
    icon.classList.replace('fas', 'far');
  }
}

// ---- Product Modal ----
function openProductModal(id) {
  modalProduct = products.find(p => p.id === id);
  if (!modalProduct) return;

  modalQty = 1;
  const name = currentLang === 'ar' ? modalProduct.name_ar : modalProduct.name_fr;
  const desc = currentLang === 'ar' ? modalProduct.description_ar : modalProduct.description_fr;
  const catLabel = currentLang === 'ar' 
    ? (modalProduct.category === 'homme' ? 'رجالي' : 'نسائي') 
    : (modalProduct.category === 'homme' ? 'Pour Homme' : 'Pour Femme');

  document.getElementById('modalImage').src = modalProduct.image;
  document.getElementById('modalImage').alt = name;
  document.getElementById('modalCategory').textContent = catLabel;
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalPrice').textContent = modalProduct.price + ' MAD';
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalQty').textContent = '1';

  // Size buttons
  const sizesContainer = document.getElementById('modalSizes');
  if (modalProduct.sizes && modalProduct.sizes.length > 0) {
    sizesContainer.innerHTML = modalProduct.sizes.map((size, i) => 
      `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${size}" onclick="selectSize(this)">${size}</button>`
    ).join('');
  }

  document.getElementById('productModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
  document.body.style.overflow = '';
  modalProduct = null;
}

document.getElementById('modalClose').addEventListener('click', closeProductModal);
document.getElementById('productModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('productModal')) closeProductModal();
});

document.getElementById('modalAddBtn').addEventListener('click', () => {
  if (modalProduct) {
    const selectedSize = document.querySelector('#modalSizes .size-btn.active');
    const size = selectedSize ? selectedSize.dataset.size : '100ml';
    for (let i = 0; i < modalQty; i++) {
      addToCart(modalProduct.id, size);
    }
    closeProductModal();
  }
});

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modalQty').textContent = modalQty;
}

function selectSize(btn) {
  document.querySelectorAll('#modalSizes .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ---- Cart Management ----
function loadCart() {
  const saved = localStorage.getItem('agharbi_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch(e) { cart = []; }
  }
}

function saveCart() {
  localStorage.setItem('agharbi_cart', JSON.stringify(cart));
}

function addToCart(productId, size = '100ml') {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: product.price,
      image: product.image,
      size: size,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(currentLang === 'fr' 
    ? `${product.name_fr} ajouté au panier` 
    : `تمت إضافة ${product.name_ar} إلى السلة`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(index, delta) {
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Badge
  const badge = document.getElementById('cartBadge');
  badge.textContent = totalItems;
  badge.classList.toggle('show', totalItems > 0);
  
  // Count
  const count = document.getElementById('cartCount');
  if (count) count.textContent = `(${totalItems})`;
  
  // Total
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = `${totalPrice} MAD`;
  
  // Footer visibility
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  if (footer) footer.style.display = totalItems > 0 ? 'block' : 'none';
  if (empty) empty.style.display = totalItems > 0 ? 'none' : 'block';
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('cartEmpty');
  
  if (cart.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyMsg);
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';
  
  container.innerHTML = cart.map((item, index) => {
    const name = currentLang === 'ar' ? item.name_ar : item.name_fr;
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-variant">${item.size}</div>
          <div class="cart-item-price">${item.price} MAD</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn" onclick="updateCartQty(${index}, -1)">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// Cart toggle
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

function checkout() {
  if (cart.length === 0) return;
  
  // Build WhatsApp message
  let msg = currentLang === 'fr' 
    ? '🛒 Nouvelle commande - Agharbi Parfum\n\n' 
    : '🛒 طلب جديد - Agharbi Parfum\n\n';
  
  cart.forEach(item => {
    const name = currentLang === 'ar' ? item.name_ar : item.name_fr;
    msg += `• ${name} (${item.size}) x${item.qty} - ${item.price * item.qty} MAD\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  msg += `\n${currentLang === 'fr' ? 'Total' : 'المجموع'}: ${total} MAD`;
  
  const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
}

// ---- Navigation ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('show');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  const closeMobile = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  mobileClose.addEventListener('click', closeMobile);
  mobileOverlay.addEventListener('click', closeMobile);
  
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

// ---- Scroll Effects ----
function initScrollEffects() {
  // Back to top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

// ---- Language Toggle ----
function initLanguage() {
  const saved = localStorage.getItem('agharbi_lang');
  if (saved) {
    currentLang = saved;
  }
  applyLanguage();

  document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    localStorage.setItem('agharbi_lang', currentLang);
    applyLanguage();
    renderProducts();
    renderCartItems();
    updateCartUI();
  });
}

function applyLanguage() {
  const html = document.documentElement;
  const langBtn = document.getElementById('langToggle');

  if (currentLang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    langBtn.textContent = 'FR';
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'fr');
    langBtn.textContent = 'AR';
  }

  // Translate all elements with data-fr/data-ar
  document.querySelectorAll('[data-fr][data-ar]').forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-fr-placeholder][data-ar-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
  });
}

// ---- Toast Notifications ----
function showToast(message, icon = 'fas fa-check-circle') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="${icon} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- Newsletter ----
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  if (email) {
    showToast(currentLang === 'fr' 
      ? 'Merci pour votre inscription !' 
      : 'شكراً لتسجيلك!');
    document.getElementById('newsletterEmail').value = '';
  }
}

// ---- Keyboard Shortcuts ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeCart();
  }
});
