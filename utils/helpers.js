function checkId(id) {
    return id;
}

function checkCoordinates(longitude, operator, latitude) {
    return longitude && latitude;
};

function checkPhone(phone) {
    return phone;
}

function checkWebsite(website) {
    return website;
}

module.exports = { checkId, checkCoordinates, checkPhone, checkWebsite }