const User = require('./User');
const Breweries = require('./breweries');

User.hasMany(Breweries, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Breweries.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Breweries };
