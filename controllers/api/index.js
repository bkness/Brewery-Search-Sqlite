const router = require('express').Router();

const breweriesRoutes = require('./breweries-routes');
const userRoutes = require('./user-routes');


router.use('/breweries', breweriesRoutes);
router.use('/User', userRoutes);


module.exports = router;