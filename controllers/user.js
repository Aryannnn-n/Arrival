const User = require('../models/user');

module.exports.signUpForm = (req, res) => {
  res.render('users/signup');
};

module.exports.signUpSave = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome To Arrival !');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.loginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  let { username } = req.body;
  req.flash('success', `Welcome Back ${username} !`);
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logout Successful !');
    res.redirect('/listings');
  });
};
