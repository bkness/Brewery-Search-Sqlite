const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        // console.log(req.body)
        const userData = await User.create({
            email: req.body.email,
            name: req.body.username,
            password: req.body.password
        });

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.name } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect username' });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password)

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json({ User: userData, message: 'Login successful' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
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