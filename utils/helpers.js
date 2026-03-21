function checkId(id) {
  return id;
}

function includes(array, value) {
  return Array.isArray(array) && array.includes(value);
}

function checkCoordinates(longitude, latitude) {
  return !!longitude && !!latitude;
}

function checkPhone(phone) {
  return phone;
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
  checkPhone,
  checkWebsite,
  isSaved,
};
