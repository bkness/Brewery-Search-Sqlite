const sequelize = require('../config/connection');
const seedUser = require('./usersData');
const seedBreweries = require('./breweriesData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedUser();

  await seedBreweries();

  process.exit(0);
};

seedAll();
