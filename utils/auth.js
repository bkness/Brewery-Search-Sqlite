const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    return res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;
