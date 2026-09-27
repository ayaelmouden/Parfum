/* ============================================
   AGHARBI PARFUM - Admin Panel JS
   Uses SheetJS (xlsx) for Excel import/export
   ============================================ */

// ---- Default Products (same as app.js) ----
const DEFAULT_PRODUCTS = [
  {
    id: 1, name_fr: "Oud Royal", name_ar: "عود ملكي", category: "homme", price: 450,
    image: "images/perfume-men-1.jpg",
    description_fr: "Un parfum masculin intense aux notes de oud, ambre et bois de santal.",
    description_ar: "عطر رجالي مكثف بنفحات العود والعنبر وخشب الصندل.",
    sizes: ["50ml", "100ml", "150ml"], badge: "bestseller", badge_fr: "Best-seller", badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 2, name_fr: "Rose d'Orient", name_ar: "وردة الشرق", category: "femme", price: 380,
    image: "images/perfume-women-1.jpg",
    description_fr: "Une fragrance féminine envoûtante aux notes de rose de Damas.",
    description_ar: "عطر نسائي ساحر بنفحات وردة دمشق.",
    sizes: ["50ml", "100ml"], badge: "nouveau", badge_fr: "Nouveau", badge_ar: "جديد"
  },
  {
    id: 3, name_fr: "Nuit Dorée", name_ar: "الليلة الذهبية", category: "homme", price: 520,
    image: "images/perfume-men-2.jpg",
    description_fr: "Un parfum sophistiqué aux notes de cuir, tabac et vanille.",
    description_ar: "عطر راقي بنفحات الجلد والتبغ والفانيليا.",
    sizes: ["50ml", "100ml", "150ml"], badge: "bestseller", badge_fr: "Best-seller", badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 4, name_fr: "Fleur de Lune", name_ar: "زهرة القمر", category: "femme", price: 420,
    image: "images/perfume-women-2.jpg",
    description_fr: "Un bouquet floral délicat aux notes de pivoine et iris.",
    description_ar: "باقة زهرية رقيقة بنفحات الفاوانيا والسوسن.",
    sizes: ["50ml", "100ml"], badge: "", badge_fr: "", badge_ar: ""
  },
  {
    id: 5, name_fr: "Ambre Mystique", name_ar: "عنبر صوفي", category: "homme", price: 490,
    image: "images/perfume-unisex-1.jpg",
    description_fr: "Un parfum oriental mystérieux aux notes d'ambre et encens.",
    description_ar: "عطر شرقي غامض بنفحات العنبر والبخور.",
    sizes: ["50ml", "100ml", "150ml"], badge: "nouveau", badge_fr: "Nouveau", badge_ar: "جديد"
  },
  {
    id: 6, name_fr: "Jasmin Noir", name_ar: "ياسمين أسود", category: "femme", price: 350,
    image: "images/perfume-women-1.jpg",
    description_fr: "Un parfum captivant aux notes de jasmin noir et vanille.",
    description_ar: "عطر آسر بنفحات الياسمين الأسود والفانيليا.",
    sizes: ["50ml", "100ml"], badge: "bestseller", badge_fr: "Best-seller", badge_ar: "الأكثر مبيعاً"
  },
  {
    id: 7, name_fr: "Bois Précieux", name_ar: "أخشاب ثمينة", category: "homme", price: 560,
    image: "images/perfume-men-1.jpg",
    description_fr: "Un accord boisé raffiné aux notes de bois de agar et cèdre.",
    description_ar: "تناغم خشبي راقي بنفحات خشب العقر والأرز.",
    sizes: ["50ml", "100ml", "150ml"], badge: "", badge_fr: "", badge_ar: ""
  },
  {
    id: 8, name_fr: "Essence de Musc", name_ar: "خلاصة المسك", category: "femme", price: 390,
    image: "images/perfume-women-2.jpg",
    description_fr: "Un parfum sensuel aux notes de musc blanc et fleur d'oranger.",
    description_ar: "عطر حسي بنفحات المسك الأبيض وزهر البرتقال.",
    sizes: ["50ml", "100ml"], badge: "nouveau", badge_fr: "Nouveau", badge_ar: "جديد"
  }
];

// ---- Admin Auth ----
const ADMIN_PIN = "1234";

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('agharbi_admin_auth') === 'true';
  const overlay = document.getElementById('adminAuthOverlay');
  const container = document.getElementById('adminMainContainer');
  if (isAuth) {
    if (overlay) overlay.style.display = 'none';
    if (container) container.style.display = 'block';
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (container) container.style.display = 'none';
  }
}

function verifyAdminPassword(e) {
  e.preventDefault();
  const pwd = document.getElementById('adminPasswordInput').value;
  const errorMsg = document.getElementById('authErrorMsg');
  if (pwd === ADMIN_PIN || pwd === "agharbi2024") {
    sessionStorage.setItem('agharbi_admin_auth', 'true');
    if (errorMsg) errorMsg.style.display = 'none';
    checkAdminAuth();
    showToast('Bienvenue dans l\'administration !');
  } else {
    if (errorMsg) errorMsg.style.display = 'block';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordInput').focus();
  }
}

function lockAdmin() {
  sessionStorage.removeItem('agharbi_admin_auth');
  checkAdminAuth();
  showToast('Déconnecté de l\'administration');
}

let products = [];
let pendingImport = [];

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadProducts();
  renderTable();
  updateStats();
  initDragDrop();
});

// ---- Products CRUD ----
function loadProducts() {
  const saved = localStorage.getItem('agharbi_products');
  if (saved) {
    try { products = JSON.parse(saved); } catch (e) { products = [...DEFAULT_PRODUCTS]; }
  } else {
    products = [...DEFAULT_PRODUCTS];
  }
}

function saveProducts() {
  localStorage.setItem('agharbi_products', JSON.stringify(products));
}

function getNextId() {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function renderTable() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--color-white-muted);">
      Aucun produit. Importez depuis Excel ou ajoutez manuellement.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="product-thumb" src="${p.image}" alt="${p.name_fr}" onerror="this.src='images/perfume-men-1.jpg'"></td>
      <td>${p.name_fr}</td>
      <td style="direction:rtl;">${p.name_ar}</td>
      <td><span class="product-badge" style="position:static;">${p.category === 'homme' ? 'Homme' : 'Femme'}</span></td>
      <td>${p.price} MAD</td>
      <td>${p.badge_fr || '—'}</td>
      <td>
        <div class="actions-cell">
          <button class="action-btn" onclick="editProduct(${p.id})" title="Modifier"><i class="fas fa-pen"></i></button>
          <button class="action-btn delete" onclick="deleteProduct(${p.id})" title="Supprimer"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStats() {
  document.getElementById('statTotal').textContent = products.length;
  document.getElementById('statHomme').textContent = products.filter(p => p.category === 'homme').length;
  document.getElementById('statFemme').textContent = products.filter(p => p.category === 'femme').length;
  document.getElementById('statBestseller').textContent = products.filter(p => p.badge === 'bestseller').length;
}

function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderTable();
  updateStats();
  showToast('Produit supprimé');
}

function clearAllProducts() {
  if (!confirm('Supprimer TOUS les produits ? Cette action est irréversible.')) return;
  products = [];
  saveProducts();
  renderTable();
  updateStats();
  showToast('Tous les produits ont été supprimés');
}

// ---- Add Product Manually ----
function addProductManual(e) {
  e.preventDefault();

  const badge = document.getElementById('addBadge').value;
  let badge_fr = '', badge_ar = '';
  if (badge === 'nouveau') { badge_fr = 'Nouveau'; badge_ar = 'جديد'; }
  if (badge === 'bestseller') { badge_fr = 'Best-seller'; badge_ar = 'الأكثر مبيعاً'; }

  const product = {
    id: getNextId(),
    name_fr: document.getElementById('addNameFr').value,
    name_ar: document.getElementById('addNameAr').value,
    category: document.getElementById('addCategory').value,
    price: parseInt(document.getElementById('addPrice').value) || 0,
    image: document.getElementById('addImage').value || 'images/perfume-men-1.jpg',
    description_fr: document.getElementById('addDescFr').value,
    description_ar: document.getElementById('addDescAr').value,
    sizes: document.getElementById('addSizes').value.split(',').map(s => s.trim()).filter(s => s),
    badge: badge,
    badge_fr: badge_fr,
    badge_ar: badge_ar
  };

  products.push(product);
  saveProducts();
  renderTable();
  updateStats();
  showToast(`"${product.name_fr}" ajouté avec succès`);

  // Reset form
  e.target.reset();
  document.getElementById('addImage').value = 'images/perfume-men-1.jpg';
  document.getElementById('addSizes').value = '50ml, 100ml, 150ml';
  
  // Switch to products tab
  showTab('products');
}

// ---- Edit Product ----
function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('editId').value = id;
  document.getElementById('editNameFr').value = product.name_fr;
  document.getElementById('editNameAr').value = product.name_ar;
  document.getElementById('editCategory').value = product.category;
  document.getElementById('editPrice').value = product.price;
  document.getElementById('editBadge').value = product.badge || '';
  document.getElementById('editImage').value = product.image;
  document.getElementById('editDescFr').value = product.description_fr;
  document.getElementById('editDescAr').value = product.description_ar;

  document.getElementById('editModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('show');
  document.body.style.overflow = '';
}

function saveEditProduct(e) {
  e.preventDefault();

  const id = parseInt(document.getElementById('editId').value);
  const product = products.find(p => p.id === id);
  if (!product) return;

  const badge = document.getElementById('editBadge').value;
  let badge_fr = '', badge_ar = '';
  if (badge === 'nouveau') { badge_fr = 'Nouveau'; badge_ar = 'جديد'; }
  if (badge === 'bestseller') { badge_fr = 'Best-seller'; badge_ar = 'الأكثر مبيعاً'; }

  product.name_fr = document.getElementById('editNameFr').value;
  product.name_ar = document.getElementById('editNameAr').value;
  product.category = document.getElementById('editCategory').value;
  product.price = parseInt(document.getElementById('editPrice').value) || 0;
  product.badge = badge;
  product.badge_fr = badge_fr;
  product.badge_ar = badge_ar;
  product.image = document.getElementById('editImage').value;
  product.description_fr = document.getElementById('editDescFr').value;
  product.description_ar = document.getElementById('editDescAr').value;

  saveProducts();
  renderTable();
  updateStats();
  closeEditModal();
  showToast(`"${product.name_fr}" modifié avec succès`);
}

// ---- Tab Navigation ----
function showTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  
  const tabMap = {
    'products': 'tabProducts',
    'import': 'tabImport',
    'add': 'tabAdd'
  };

  const el = document.getElementById(tabMap[tab]);
  if (el) el.style.display = 'block';

  // Update active nav
  const navLinks = document.querySelectorAll('.admin-nav a');
  navLinks.forEach(a => {
    if (a.textContent.toLowerCase().includes(tab === 'products' ? 'produits' : tab === 'import' ? 'import' : 'ajouter')) {
      a.classList.add('active');
    }
  });
}

// ---- Excel Import (SheetJS) ----
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        showToast('Le fichier est vide', 'fas fa-exclamation-triangle');
        return;
      }

      // Map columns
      pendingImport = jsonData.map((row, index) => {
        const badge = (row.badge || row.Badge || '').toString().toLowerCase();
        let badge_fr = '', badge_ar = '';
        if (badge === 'nouveau' || badge === 'new') { badge_fr = 'Nouveau'; badge_ar = 'جديد'; }
        if (badge === 'bestseller' || badge === 'best-seller') { badge_fr = 'Best-seller'; badge_ar = 'الأكثر مبيعاً'; }

        return {
          id: getNextId() + index,
          name_fr: row.name_fr || row.nom_fr || row['Nom (FR)'] || row.name || '',
          name_ar: row.name_ar || row.nom_ar || row['Nom (AR)'] || '',
          category: (row.category || row.categorie || row['Catégorie'] || 'homme').toString().toLowerCase(),
          price: parseInt(row.price || row.prix || row['Prix'] || 0),
          image: row.image || row.Image || 'images/perfume-men-1.jpg',
          description_fr: row.description_fr || row.desc_fr || row['Description (FR)'] || '',
          description_ar: row.description_ar || row.desc_ar || row['Description (AR)'] || '',
          sizes: (row.sizes || row.tailles || row.Tailles || '50ml, 100ml').toString().split(',').map(s => s.trim()),
          badge: badge,
          badge_fr: badge_fr,
          badge_ar: badge_ar
        };
      });

      renderPreview();
      showToast(`${pendingImport.length} produit(s) détecté(s) dans le fichier`);

    } catch (err) {
      console.error('Error reading file:', err);
      showToast('Erreur de lecture du fichier. Vérifiez le format.', 'fas fa-exclamation-triangle');
    }
  };

  reader.readAsArrayBuffer(file);
}

function renderPreview() {
  const tbody = document.getElementById('previewTableBody');
  tbody.innerHTML = pendingImport.map(p => `
    <tr>
      <td>${p.name_fr}</td>
      <td style="direction:rtl;">${p.name_ar}</td>
      <td>${p.category}</td>
      <td>${p.price} MAD</td>
      <td>${p.description_fr.substring(0, 50)}${p.description_fr.length > 50 ? '...' : ''}</td>
      <td>${p.badge_fr || '—'}</td>
    </tr>
  `).join('');

  document.getElementById('previewSection').style.display = 'block';
}

function confirmImport() {
  if (pendingImport.length === 0) return;

  // Reassign IDs to avoid conflicts
  const startId = getNextId();
  pendingImport.forEach((p, i) => {
    p.id = startId + i;
  });

  products = [...products, ...pendingImport];
  saveProducts();
  renderTable();
  updateStats();

  showToast(`${pendingImport.length} produit(s) importé(s) avec succès !`);
  
  pendingImport = [];
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('excelFile').value = '';
  
  // Switch to products tab
  showTab('products');
}

function cancelImport() {
  pendingImport = [];
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('excelFile').value = '';
}

// ---- Excel Export ----
function exportToExcel() {
  if (products.length === 0) {
    showToast('Aucun produit à exporter', 'fas fa-info-circle');
    return;
  }

  const exportData = products.map(p => ({
    'Nom (FR)': p.name_fr,
    'Nom (AR)': p.name_ar,
    'Catégorie': p.category,
    'Prix': p.price,
    'Image': p.image,
    'Description (FR)': p.description_fr,
    'Description (AR)': p.description_ar,
    'Tailles': p.sizes ? p.sizes.join(', ') : '',
    'Badge': p.badge || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produits');

  // Auto-fit column widths
  const colWidths = Object.keys(exportData[0]).map(key => ({
    wch: Math.max(key.length, ...exportData.map(row => (row[key] || '').toString().length))
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, 'agharbi_parfum_produits.xlsx');
  showToast('Fichier Excel exporté avec succès !');
}

// ---- Download Template ----
function downloadTemplate() {
  const template = [
    {
      'Nom (FR)': 'Exemple Parfum',
      'Nom (AR)': 'عطر مثال',
      'Catégorie': 'homme',
      'Prix': 450,
      'Image': 'images/perfume-men-1.jpg',
      'Description (FR)': 'Description du parfum en français',
      'Description (AR)': 'وصف العطر بالعربية',
      'Tailles': '50ml, 100ml, 150ml',
      'Badge': 'nouveau'
    },
    {
      'Nom (FR)': 'Exemple Parfum 2',
      'Nom (AR)': 'عطر مثال 2',
      'Catégorie': 'femme',
      'Prix': 380,
      'Image': 'images/perfume-women-1.jpg',
      'Description (FR)': 'Description du parfum féminin',
      'Description (AR)': 'وصف العطر النسائي',
      'Tailles': '50ml, 100ml',
      'Badge': 'bestseller'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modèle');

  // Style hints
  const colWidths = Object.keys(template[0]).map(key => ({
    wch: Math.max(key.length + 4, 20)
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, 'agharbi_modele_produits.xlsx');
  showToast('Modèle Excel téléchargé !');
}

// ---- Load Default CSV File ----
function loadDefaultCSV() {
  fetch('produits_agharbi.csv')
    .then(res => {
      if (!res.ok) throw new Error('Fichier produits_agharbi.csv introuvable');
      return res.text();
    })
    .then(csvText => {
      const workbook = XLSX.read(csvText, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        showToast('Le fichier produits_agharbi.csv est vide');
        return;
      }

      pendingImport = jsonData.map((row, index) => {
        const badge = (row.badge || row.Badge || '').toString().toLowerCase();
        let badge_fr = '', badge_ar = '';
        if (badge === 'nouveau' || badge === 'new') { badge_fr = 'Nouveau'; badge_ar = 'جديد'; }
        if (badge === 'bestseller' || badge === 'best-seller') { badge_fr = 'Best-seller'; badge_ar = 'الأكثر مبيعاً'; }

        return {
          id: getNextId() + index,
          name_fr: row.name_fr || row.nom_fr || row['Nom (FR)'] || row.name || '',
          name_ar: row.name_ar || row.nom_ar || row['Nom (AR)'] || '',
          category: (row.category || row.categorie || row['Catégorie'] || 'homme').toString().toLowerCase(),
          price: parseInt(row.price || row.prix || row['Prix'] || 0),
          image: row.image || row.Image || 'images/perfume-men-1.jpg',
          description_fr: row.description_fr || row.desc_fr || row['Description (FR)'] || '',
          description_ar: row.description_ar || row.desc_ar || row['Description (AR)'] || '',
          sizes: (row.sizes || row.tailles || row.Tailles || '50ml, 100ml').toString().split(',').map(s => s.trim()),
          badge: badge,
          badge_fr: badge_fr,
          badge_ar: badge_ar
        };
      });

      renderPreview();
      showToast(`${pendingImport.length} produit(s) chargés depuis produits_agharbi.csv`);
    })
    .catch(err => {
      console.error(err);
      showToast('Impossible de charger produits_agharbi.csv', 'fas fa-exclamation-triangle');
    });
}

// ---- Drag & Drop ----
function initDragDrop() {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;

  ['dragenter', 'dragover'].forEach(event => {
    zone.addEventListener(event, (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(event => {
    zone.addEventListener(event, (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
    });
  });

  zone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.getElementById('excelFile');
      // Create a DataTransfer to set files on input
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      fileInput.files = dt.files;
      handleFileUpload({ target: fileInput });
    }
  });
}

// ---- Toast ----
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

// ---- Keyboard ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeEditModal();
});
