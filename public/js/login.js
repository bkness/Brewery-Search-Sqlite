// // ======================
// // CONSTANTS
// // ======================
// const STATES = [
//   'Alabama',
//   'Alaska',
//   'Arizona',
//   'Arkansas',
//   'California',
//   'Colorado',
//   'Connecticut',
//   'Delaware',
//   'Florida',
//   'Georgia',
//   'Hawaii',
//   'Idaho',
//   'Illinois',
//   'Indiana',
//   'Iowa',
//   'Kansas',
//   'Kentucky',
//   'Louisiana',
//   'Maine',
//   'Maryland',
//   'Massachusetts',
//   'Michigan',
//   'Minnesota',
//   'Mississippi',
//   'Missouri',
//   'Montana',
//   'Nebraska',
//   'Nevada',
//   'New Hampshire',
//   'New Jersey',
//   'New Mexico',
//   'New York',
//   'North Carolina',
//   'North Dakota',
//   'Ohio',
//   'Oklahoma',
//   'Oregon',
//   'Pennsylvania',
//   'Rhode Island',
//   'South Carolina',
//   'South Dakota',
//   'Tennessee',
//   'Texas',
//   'Utah',
//   'Vermont',
//   'Virginia',
//   'Washington',
//   'West Virginia',
//   'Wisconsin',
//   'Wyoming',
// ];

// const TOTAL_BG_IMAGES = 23;

// // ======================
// // GLOBALS
// // ======================
// let tiles = [];
// let modalMap;
// let marker;
// let tileResizeTimer;

// // ======================
// // DOM CONTENT LOADED INIT
// // ======================
// document.addEventListener('DOMContentLoaded', () => {
//   loadBackgroundGrid();
//   init();
// });

// // ======================
// // BACKGROUND GRID
// // ======================
// function loadBackgroundGrid() {
//   const container = document.querySelector('.bg-grid');
//   if (!container) return;

//   container.innerHTML = '';
//   const fragment = document.createDocumentFragment();

//   const cols = Math.ceil(window.innerWidth / 250);
//   const rows = Math.ceil(window.innerHeight / 180);
//   const totalTiles = cols * rows;

//   for (let i = 0; i < totalTiles; i++) {
//     const tile = document.createElement('div');
//     tile.className = 'bg-tile';
//     tile.style.backgroundImage = `url(/images/bar-${(i % TOTAL_BG_IMAGES) + 1}.jpg)`;
//     tile.style.filter = `brightness(${0.65 + Math.random() * 0.15}) saturate(${0.9 + Math.random() * 0.2})`;
//     tile.style.animationDelay = `${(i * 0.05) % 2}s`;
//     fragment.appendChild(tile);
//   }

//   container.appendChild(fragment);
//   tiles = container.querySelectorAll('.bg-tile');
// }

// // Debounced resize
// window.addEventListener('resize', () => {
//   clearTimeout(tileResizeTimer);
//   tileResizeTimer = setTimeout(loadBackgroundGrid, 120);
// });

// // ======================
// // PASSWORD TOGGLE
// // ======================
// document.querySelectorAll('.toggle-pass').forEach((btn) => {
//   btn.addEventListener('click', () => {
//     const input = document.querySelector(btn.dataset.target);
//     input.type = input.type === 'password' ? 'text' : 'password';
//     btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
//   });
// });

// async function parseApiError(res, fallbackMessage) {
//   const contentType = res.headers.get('content-type') || '';

//   if (contentType.includes('application/json')) {
//     const data = await res.json();
//     return data?.message || fallbackMessage;
//   }

//   const text = await res.text();
//   return text || fallbackMessage;
// }

// // ======================
// // LOGIN FORM
// // ======================
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//   e.preventDefault(); // prevent page reload

//   const email = document.getElementById('loginName').value.trim();
//   const password = document.getElementById('loginPassword').value.trim();
//   const loginError = document.getElementById('loginError');

//   loginError.textContent = ''; // clear previous errors

//   if (!email || !password) {
//     loginError.textContent = 'Please fill in both fields.';
//     return;
//   }

//   try {
//     const res = await fetch('/api/user/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) {
//       const message = await parseApiError(res, 'Login failed');
//       throw new Error(message);
//     }

//     // redirect or update UI
//     window.location.href = '/';
//   } catch (err) {
//     loginError.textContent = err.message;
//   }
//   });
// }

// // ======================
// // SIGNUP FORM
// // ======================
// const signupForm = document.getElementById('signupForm');
// if (signupForm) {
//   signupForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const name = document.getElementById('createName').value.trim();
//   const email = document.getElementById('createEmail').value.trim();
//   const password = document.getElementById('createPassword').value.trim();
//   const signupError = document.getElementById('signupError');

//   signupError.textContent = '';

//   if (!name || !email || !password) {
//     signupError.textContent = 'All fields are required.';
//     return;
//   }

//   try {
//     const res = await fetch('/api/user', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password }),
//     });

//     if (!res.ok) {
//       const message = await parseApiError(res, 'Signup failed');
//       throw new Error(message);
//     }

//     // redirect or show message
//     window.location.href = '/';
//   } catch (err) {
//     signupError.textContent = err.message;
//   }
//   });
// }

// // ======================
// // TOAST NOTIFICATIONS
// // ======================
// function showToast(message, undoCallback = null) {
//   const toast = createToastElement(message, undoCallback);
//   document.body.appendChild(toast);

//   requestAnimationFrame(() => {
//     toast.style.opacity = '1';
//     toast.style.transform = 'translateY(0)';
//   });

//   setTimeout(() => {
//     toast.style.opacity = '0';
//     toast.style.transform = 'translateY(20px)';
//     setTimeout(() => toast.remove(), 300);
//   }, 3000);
// }

// function createToastElement(message, undoCallback) {
//   const toast = document.createElement('div');
//   toast.className = 'toast';
//   const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

//   toast.innerHTML = `
//     <span>${message}</span>
//     ${undoCallback ? '<button class="undo-btn">Undo</button>' : ''}
//   `;

//   Object.assign(toast.style, {
//     position: 'fixed',
//     right: '20px',
//     bottom: '20px',
//     zIndex: '9999',
//     background: '#1f2937',
//     color: '#fff',
//     padding: isDesktop ? '18px 24px' : '14px 20px',
//     borderRadius: '10px',
//     minWidth: isDesktop ? '360px' : 'auto',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '12px',
//     boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
//     opacity: '0',
//     transform: 'translateY(20px)',
//     transition: 'all 0.3s ease',
//     fontSize: isDesktop ? '16px' : '14px',
//     fontWeight: '500',
//   });

//   if (undoCallback) setupUndoButton(toast, undoCallback, isDesktop);
//   return toast;
// }

// function setupUndoButton(toast, callback, isDesktop) {
//   const undoBtn = toast.querySelector('.undo-btn');
//   Object.assign(undoBtn.style, {
//     border: '0',
//     borderRadius: '6px',
//     padding: isDesktop ? '8px 12px' : '6px 10px',
//     fontSize: isDesktop ? '14px' : '12px',
//     fontWeight: '600',
//     cursor: 'pointer',
//   });

//   undoBtn.onclick = async () => {
//     try {
//       await callback();
//     } catch (err) {
//       console.error(err);
//       showToast('Unable to undo action');
//     }
//     toast.remove();
//   };
// }

// // ======================
// // CUSTOM SELECT FOR STATES
// // ======================
// function setupCustomSelect() {
//   const container = document.getElementById('state-select');
//   if (!container) return;

//   const input = container.querySelector('.custom-select-input');
//   const hiddenInput = container.querySelector("input[type='hidden']");
//   const dropdown = container.querySelector('.custom-select-dropdown');

//   function renderOptions(filter = '') {
//     const filtered = STATES.filter((state) => state.toLowerCase().includes(filter.toLowerCase()));

//     dropdown.innerHTML = filtered.map((state) => `<div class="option">${state}</div>`).join('');
//     dropdown.classList.remove('hidden');
//   }

//   input.addEventListener('focus', () => renderOptions(''));
//   input.addEventListener('input', (e) => {
//     hiddenInput.value = e.target.value.trim();
//     renderOptions(e.target.value);
//   });

//   dropdown.addEventListener('click', (e) => {
//     if (e.target.classList.contains('option')) {
//       input.value = hiddenInput.value = e.target.textContent;
//       dropdown.classList.add('hidden');
//     }
//   });

//   document.addEventListener('click', (e) => {
//     if (!container.contains(e.target)) dropdown.classList.add('hidden');
//   });
// }

// // ======================
// // INITIALIZATION
// // ======================
// function init() {
//   const form = document.querySelector('#search-form');
//   if (form) form.addEventListener('submit', handleSearch);

//   setupCustomSelect();
//   document.addEventListener('click', handleGlobalClick);

//   const mapModal = document.getElementById('map-modal');
//   const closeMapBtn = document.getElementById('close-map');

//   if (closeMapBtn) closeMapBtn.addEventListener('click', closeModal);
//   if (mapModal) {
//     mapModal.addEventListener('click', (e) => {
//       if (e.target.id === 'map-modal') closeModal();
//     });
//   }

//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') closeModal();
//   });
// }

// // ======================
// // SEARCH HANDLER
// // ======================
// function handleSearch(e) {
//   e.preventDefault();

//   const form = e.currentTarget;
//   const name = form.querySelector('[name="name"]')?.value.trim() || '';
//   const city = form.querySelector('[name="city"]')?.value.trim() || '';
//   const state = form.querySelector('[name="state"]')?.value.trim() || '';

//   if (!name && !city && !state) return alert('Please enter a brewery name, city, or state');

//   const params = new URLSearchParams();
//   if (name) params.set('name', name);
//   if (city) params.set('city', city);
//   if (state) params.set('state', state);

//   window.location.href = `/search?${params.toString()}`;
// }

// // ======================
// // GLOBAL CLICK HANDLER
// // ======================
// const handlers = {
//   '.btn-save-brewery': handleSave,
//   '.btn-map-brewery': handleMap,
// };

// function handleGlobalClick(e) {
//   Object.entries(handlers).forEach(([selector, fn]) => {
//     const btn = e.target.closest(selector);
//     if (btn) fn(btn);
//   });
// }

// // ======================
// // SAVE BREWERY
// // ======================
// async function handleSave(btn) {
//   const originalLabel = btn.textContent;
//   btn.disabled = true;
//   btn.textContent = 'Saving...';

//   const brewery = {
//     refid: btn.dataset.id,
//     brewname: btn.dataset.name,
//     address: btn.dataset.address || '',
//     city: btn.dataset.city,
//     state: btn.dataset.state,
//     zipcode: btn.dataset.zip || '',
//     phone: btn.dataset.phone || '',
//     website: btn.dataset.website || '',
//     latitude: btn.dataset.lat || '',
//     longitude: btn.dataset.lng || '',
//     remark: btn.dataset.type,
//     comment: '',
//     currentDate: new Date().toDateString(),
//   };

//   try {
//     const res = await fetch('/api/breweries/addbrewery/', {
//       method: 'POST',
//       body: JSON.stringify(brewery),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     if (res.status === 401) {
//       showToast('Please log in first');
//       btn.disabled = false;
//       btn.textContent = originalLabel;
//       setTimeout(() => (window.location.href = '/login'), 1500);
//       return;
//     }

//     if (!res.ok) {
//       showToast('Already saved or error');
//       btn.disabled = false;
//       btn.textContent = originalLabel;
//       return;
//     }

//     const savedBrewery = await res.json();
//     btn.textContent = 'Saved ✓';
//     btn.disabled = true;
//     btn.style.opacity = '0.6';

//     showToast('✅ Brewery saved!', async () => {
//       if (!savedBrewery?.id) return showToast('Undo not available');

//       const undoRes = await fetch(`/api/breweries/${savedBrewery.id}`, { method: 'DELETE' });
//       if (!undoRes.ok) return showToast('Unable to undo save');

//       btn.textContent = originalLabel;
//       btn.disabled = false;
//       btn.style.opacity = '1';
//       showToast('Save undone');
//     });
//   } catch (err) {
//     console.error(err);
//     btn.textContent = originalLabel;
//     btn.disabled = false;
//     showToast('❌ Failed to save brewery');
//   }
// }

// // ======================
// // MAP MODAL
// // ======================
// function handleMap(btn) {
//   const name = btn.dataset.name;
//   const lat = parseFloat(btn.dataset.lat);
//   const lng = parseFloat(btn.dataset.lng);

//   if (Number.isNaN(lat) || Number.isNaN(lng)) return showToast('Location not available');

//   const modal = document.getElementById('map-modal');
//   modal.classList.remove('hidden');
//   requestAnimationFrame(() => modal.classList.add('active'));
//   document.body.style.overflow = 'hidden';

//   setTimeout(() => {
//     if (!modalMap) {
//       modalMap = L.map('modal-map').setView([lat, lng], 13);
//       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(
//         modalMap
//       );
//     } else {
//       modalMap.invalidateSize();
//       const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//       const isMobile = window.matchMedia('(max-width: 768px)').matches;
//       reduceMotion
//         ? modalMap.setView([lat, lng], 13)
//         : modalMap.flyTo([lat, lng], 13, { animate: true, duration: isMobile ? 0.75 : 1.2 });
//     }

//     if (marker) modalMap.removeLayer(marker);
//     marker = L.marker([lat, lng]).addTo(modalMap).bindPopup(name).openPopup();
//   }, 180);
// }

// function closeModal() {
//   const modal = document.getElementById('map-modal');
//   if (modal.classList.contains('hidden')) return;

//   modal.classList.remove('active');
//   const onTransitionEnd = () => {
//     modal.classList.add('hidden');
//     modal.removeEventListener('transitionend', onTransitionEnd);
//   };
//   modal.addEventListener('transitionend', onTransitionEnd);
//   document.body.style.overflow = '';
// }
