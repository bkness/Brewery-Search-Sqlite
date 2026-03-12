const { User } = require('../models');

const userdata = [
  {
    name: 'StevenBlake',
    email: 's@b.com',
    password: 'Brew1234'
  },
  {
    name: 'BrandonKelly',
    email: 'b@k.com',
    password: 'Brew1234'
  },
  {
    name: 'ShawnClarke',
    email: 's@c.com',
    password: 'Brew1234'
  },
];

const seedUser = () => User.bulkCreate(userdata, {
  individualHooks: true,
  returning: true,
});

module.exports = seedUser;