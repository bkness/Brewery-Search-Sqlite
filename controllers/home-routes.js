const router = require("express").Router();
const { Breweries, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const postData = await Breweries.findAll({
      include: [User],
    });

    const brewery = postData.map((brewery) => brewery.get({ plain: true })); // session of object is global to backend

    const breweryData = await fetch(
      "https://api.openbrewerydb.org/v1/breweries?by_city=phoenix",
    );
    const apiData = await breweryData.json();

    // console.log(apiData)

    // res.json(apiData)
    res.render("homepage", {
      apiData,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

router.get("/citySearch/:searchCity", async (req, res) => {
  try {
    //console.log(req.params.searchCity);
    const brewUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${req.params.searchCity}`;
    const breweryData = await fetch(brewUrl);
    const apiData = await breweryData.json();

    //console.log('hi')

    //res.json(apiData)
    res.render("homepage", {
      apiData,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;
