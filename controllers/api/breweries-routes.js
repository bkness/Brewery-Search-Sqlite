const router = require("express").Router();
const { Breweries, User } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all saved breweries for logged-in user
router.get("/", withAuth, async (req, res) => {
  try {
    const brewData = await Breweries.findAll({
      where: { user_id: req.session.user_id },
      include: [User],
      order: [["createdAt", "DESC"]],
    });

    const breweries = brewData.map((b) => b.get({ plain: true }));

    res.render("mypubs", {
      breweries,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET single saved brewery
router.get("/singlebrewery/:id", withAuth, async (req, res) => {
  try {
    const brewData = await Breweries.findByPk(req.params.id);

    if (!brewData) {
      return res.status(404).render("404");
    }

    const brewery = brewData.get({ plain: true });

    res.render("singlebrewery", {
      brewery,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ADD brewery
router.post("/addbrewery", withAuth, async (req, res) => {
  try {
    const newBrew = await Breweries.create({
      refid: req.body.refid,
      brewname: req.body.brewname,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode || req.body.zip || "",
      phone: req.body.phone,
      website: req.body.website,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      remark: req.body.remark,
      comments: req.body.comment,
      created_date: req.body.currentDate,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBrew);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// UPDATE brewery comment
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updated = await Breweries.update(
      { comments: req.body.comment },
      { where: { id: req.params.id } }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE brewery
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deleted = await Breweries.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "No brewery found" });
    }

    res.status(200).json({ deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
