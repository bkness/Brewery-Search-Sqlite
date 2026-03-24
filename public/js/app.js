no// ======================
// GLOBAL VARIABLES
// ======================
let tiles = [];
let modalMap;
let marker;
let tileResizeTimer;

const STATES = [
  /* same as your list */
];
const TOTAL_BG_IMAGES = 23;

// ======================
// DOM CONTENT LOADED
// ======================
document.addEventListener('DOMContentLoaded', () => {
  loadBackgroundGrid();
  init();
});

// ======================
// BACKGROUND GRID
// ======================
function loadBackgroundGrid() {
  const container = document.querySelector('.bg-grid');
  if (!container) return;

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  const cols = Math.ceil(window.innerWidth / 250);
  const rows = Math.ceil(window.innerHeight / 180);
  const totalTiles = cols * rows;

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'bg-tile';
    tile.style.backgroundImage = `url(/images/bar-${(i % TOTAL_BG_IMAGES) + 1}.jpg)`;
    tile.style.filter = `brightness(${0.65 + Math.random() * 0.15}) saturate(${0.9 + Math.random() * 0.2})`;
    tile.style.animationDelay = `${(i * 0.05) % 2}s`;
    fragment.appendChild(tile);
  }

  container.appendChild(fragment);
  tiles = container.querySelectorAll('.bg-tile');
}

window.addEventListener('resize', () => {
  clearTimeout(tileResizeTimer);
  tileResizeTimer = setTimeout(loadBackgroundGrid, 120);
});

// ======================
// INIT
// ======================
function init() {
  const form = document.querySelector('#search-form');
  if (form) form.addEventListener('submit', handleSearch);

  setupCustomSelect();
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleEscape);

  const mapModal = document.getElementById('map-modal');
  if (mapModal)
    mapModal.addEventListener('click', (e) => {
      if (e.target.id === 'map-modal') closeModal();
    });

  // Comment submit button
  const commentBtn = document.querySelector('#pubcommentsubmit');
  if (commentBtn) commentBtn.addEventListener('click', submitComment);

  // Single brewery delete button
  const deleteBtn = document.querySelector('#deletebrewery');
  if (deleteBtn) deleteBtn.addEventListener('click', deleteBreweryById);
}

// ======================
// ESCAPE KEY HANDLER
// ======================
function handleEscape(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeSavedMap();
  }
}

// ======================
// SEARCH
// ======================
function handleSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const name = form.querySelector('[name="name"]')?.value.trim() || '';
  const city = form.querySelector('[name="city"]')?.value.trim() || '';
  const state = form.querySelector('[name="state"]')?.value.trim() || '';

  if (!name && !city && !state) return alert('Please enter a brewery name, city, or state');

  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (city) params.set('city', city);
  if (state) params.set('state', state);

  window.location.href = `/search?${params.toString()}`;
}

// ======================
// CUSTOM SELECT
// ======================
function setupCustomSelect() {
  const container = document.getElementById('state-select');
  if (!container) return;

  const input = container.querySelector('.custom-select-input');
  const hiddenInput = container.querySelector("input[type='hidden']");
  const dropdown = container.querySelector('.custom-select-dropdown');

  function renderOptions(filter = '') {
    const filtered = STATES.filter((state) => state.toLowerCase().includes(filter.toLowerCase()));
    dropdown.innerHTML = filtered.map((state) => `<div class="option">${state}</div>`).join('');
    dropdown.classList.remove('hidden');
  }

  input.addEventListener('focus', () => renderOptions(''));
  input.addEventListener('input', (e) => {
    hiddenInput.value = e.target.value.trim();
    renderOptions(e.target.value);
  });

  dropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('option')) {
      input.value = hiddenInput.value = e.target.textContent;
      dropdown.classList.add('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) dropdown.classList.add('hidden');
  });
}

// ======================
// GLOBAL CLICK HANDLER
// ======================
function handleGlobalClick(e) {
  const btn = e.target.closest('button, a');
  if (!btn) return;

  if (btn.classList.contains('btn-save-brewery')) handleSave(btn);
  if (btn.classList.contains('btn-map-brewery')) handleMap(btn);
  if (btn.classList.contains('btn-map-saved')) openSavedMap(btn);
  const deleteBtn = document.querySelector('#deletebrewery');
if (deleteBtn) {
  deleteBtn.addEventListener('click', deleteBreweryById);
}


// ======================
// SAVE BREWERY
// ======================
async function handleSave(btn) {
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Saving...';

  const brewery = {
    refid: btn.dataset.id,
    brewname: btn.dataset.name,
    address: btn.dataset.address || '',
    city: btn.dataset.city,
    state: btn.dataset.state,
    zipcode: btn.dataset.zip || '',
    phone: btn.dataset.phone || '',
    website: btn.dataset.website || '',
    latitude: btn.dataset.lat || '',
    longitude: btn.dataset.lng || '',
    remark: btn.dataset.type,
    comment: '',
    currentDate: new Date().toDateString(),
  };

  try {
    const res = await fetch('/api/breweries/addbrewery/', {
      method: 'POST',
      body: JSON.stringify(brewery),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 401) {
      showToast('Please log in first');
      btn.disabled = false;
      btn.textContent = originalLabel;
      setTimeout(() => (window.location.href = '/login'), 1500);
      return;
    }

    if (!res.ok) {
      showToast('Already saved or error');
      btn.disabled = false;
      btn.textContent = originalLabel;
      return;
    }

    const savedBrewery = await res.json();
    btn.textContent = 'Saved ✓';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    showToast('✅ Brewery saved!', async () => {
      if (!savedBrewery?.id) return showToast('Undo not available');
      const undoRes = await fetch(`/api/breweries/${savedBrewery.id}`, { method: 'DELETE' });
      if (!undoRes.ok) return showToast('Unable to undo save');

      btn.textContent = originalLabel;
      btn.disabled = false;
      btn.style.opacity = '1';
      showToast('Save undone');
    });
  } catch (err) {
    console.error(err);
    btn.textContent = originalLabel;
    btn.disabled = false;
    showToast('❌ Failed to save brewery');
  }
}

// ======================
// DELETE BREWERY
// ======================
async function deleteBrewery(id) {
  if (!id) return;

  const res = await fetch(`/api/breweries/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.ok) {
    window.location.replace('/api/breweries');
  } else {
    showToast('Failed to delete brewery');
  }
}

// ======================
// SINGLE PAGE DELETE
// ======================
async function deleteBreweryById(e) {
  e.preventDefault();
  const brew_id = document.querySelector('#brewid')?.value;
  if (!brew_id) return;
  deleteBrewery(brew_id);
}

// ======================
// COMMENT
// ======================
async function submitComment(e) {
  e.preventDefault();
  const brew_id = document.querySelector('#brewid')?.value;
  const comment = document.querySelector('#pubcomment')?.value.trim();
  if (!brew_id || !comment) return;

  const res = await fetch(`/api/breweries/${brew_id}`, {
    method: 'PUT',
    body: JSON.stringify({ comment }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) window.location.replace('/api/breweries');
  else showToast('Failed to add comment');
}

// ======================
// MAP MODAL FOR SEARCH / SAVED
// ======================
function handleMap(btn) {
  openMap(btn.dataset.name, btn.dataset.lat, btn.dataset.lng, 'map-modal', 'modal-map');
}
function openSavedMap(btn) {
  openMap(
    btn.dataset.name,
    btn.dataset.lat,
    btn.dataset.lng,
    'mypubs-map-modal',
    'mypubs-modal-map'
  );
}

function openMap(name, latStr, lngStr, modalId, mapId) {
  const lat = parseFloat(latStr),
    lng = parseFloat(lngStr);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return showToast('Location not available');

  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
  requestAnimationFrame(() => modal.classList.add('active'));
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    if (!modalMap) {
      modalMap = L.map(mapId).setView([lat, lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(
        modalMap
      );
    } else {
      modalMap.invalidateSize();
      modalMap.flyTo([lat, lng], 13, { animate: true, duration: 1 });
    }

    if (marker) modalMap.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(modalMap).bindPopup(name).openPopup();
  }, 180);
}

function closeModal() {
  const modal = document.getElementById('map-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.remove('active');
  modal.addEventListener('transitionend', () => modal.classList.add('hidden'), { once: true });
  document.body.style.overflow = '';
}

function closeSavedMap() {
  const modal = document.getElementById('mypubs-map-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.remove('active');
  modal.addEventListener('transitionend', () => modal.classList.add('hidden'), { once: true });
  document.body.style.overflow = '';
}

const logout = async () => {
  console.log('im working');
  const response = await fetch('/api/user/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    showToast('Failed to logout');
  }
};

const logoutBtn = document.querySelector('#logout');
if (logoutBtn) logoutBtn.addEventListener('click', logout);
