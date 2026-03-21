const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userData = await User.create({
      name,
      email,
      password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.name;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0].path;

      if (field === 'email') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (field === 'name') {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    console.error(err);
    return res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const userData = await User.findOne({
      where: { email },
    });

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect email' });
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.username = userData.name;

      res.status(200).json({ User: userData, message: 'Login successful' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
