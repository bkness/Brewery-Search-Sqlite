function checkId(id) {
  return id;
}

function includes(array, value) {
  return Array.isArray(array) && array.includes(value);
}

function checkCoordinates(longitude, latitude) {
  return !!longitude && !!latitude;
}

function ensureHttp(url = '') {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function yelpUrl(name = '', city = '', state = '') {
  const parts = [name, city, state].filter(Boolean).join(' ');
  return `https://www.yelp.com/search?find_desc=${encodeURIComponent(parts)}`;
}

function googlePlaceUrl(name = '', city = '', state = '') {
  const query = [name, city, state].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function breweryExternalUrl(website = '', name = '', city = '', state = '') {
  const normalized = ensureHttp(String(website).trim());
  return normalized || googlePlaceUrl(name, city, state);
}

function formatPhone(phone) {
  if (!phone) return 'N/A';

  const digits = String(phone).replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
}

function phoneLink(phone) {
  if (!phone) return '';

  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';

  return digits.length === 10 ? `tel:+1${digits}` : `tel:+${digits}`;
}

function checkWebsite(website) {
  return website;
}

function isSaved(refid, savedRefIds) {
  return Array.isArray(savedRefIds) && savedRefIds.includes(refid);
}

module.exports = {
  checkId,
  includes,
  checkCoordinates,
  formatPhone,
  phoneLink,
  ensureHttp,
  yelpUrl,
  googlePlaceUrl,
  breweryExternalUrl,
  checkWebsite,
  isSaved,
};
