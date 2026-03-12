const { Breweries } = require('../models');

const Brewerydata = [
  {
    refid: '34e8c68b-6146-453f-a4b9-1f6cd99a5ada',
    name: '1 of Us Brewing Company',
    address: '8100 Washington Ave',
    city: 'Mount Pleasant',
    State: 'Wisconsin',
    zipcode: '53406-3920',
    Phone: '5207459175',
    Website: 'http://www.badwaterbrewing.com',
    latitude: '33.49726157',
    longitude: '-111.9244743',
    remark: 'micro',
    comments: '',
    created_date: 'November 20, 2023 08:00:00',
    user_id: '1',
  },
  {
    refid: '9c5a66c8-cc13-416f-a5d9-0a769c87d318',
    name: '(512) Brewing Co',
    address: '407 Radam Ln Ste F200',
    city: 'Austin',
    State: 'Texas',
    zipcode: '78745-1197',
    Phone: '4445556666',
    Website: 'http://www.badwaterbrewing.com',
    latitude: '33.49726157',
    longitude: '-111.9244743',
    remark: 'micro',
    comments: '',
    created_date: 'November 21, 2023 07:00:00',
    user_id: '1',
  },
  {
    refid: '5128df48-79fc-4f0f-8b52-d06be54d0cec',
    name: '(405) Brewing Co',
    address: '1716 Topeka St',
    city: 'Norman',
    State: 'Wisconsin',
    zipcode: '53406-3920',
    Phone: '5207459335',
    Website: 'http://www.badwaterbrewing.com',
    latitude: '33.49726157',
    longitude: '-111.9244743',
    remark: 'micro',
    comments: '',
    created_date: 'November 20, 2023 08:00:00',
    user_id: '2',
  },
];

const seedbreweries = () => Breweries.bulkCreate(Brewerydata);

module.exports = seedbreweries;
