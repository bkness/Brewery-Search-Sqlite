const router = require("express").Router();

const breweriesRoutes = require("./breweries-routes");
const userRoutes = require("./user-routes");

router.use("/breweries", breweriesRoutes);
router.use("/user", userRoutes);

module.exports = router;
