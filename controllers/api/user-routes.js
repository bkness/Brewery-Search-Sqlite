const router = require("express").Router();
const { User } = require("../../models");

router.post("/", async (req, res) => {
  try {
    // console.log(req.body)
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors[0].path;

      if (field === "email") {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (field === "name") {
        return res.status(400).json({ message: "Username already exists" });
      }
    }
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { email: req.body.email.toLowerCase() },
    });

    if (!userData) {
      return res.status(400).json({ message: "Incorrect email" });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json({ User: userData, message: "Login successful" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
