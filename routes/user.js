const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

// MVC ptrn
const {
  signUpForm,
  signUpSave,
  loginForm,
  login,
  logOut,
} = require('../controllers/user');

router.route('/signup').get(signUpForm).post(wrapAsync(signUpSave));

router
  .route('/login')
  .get(loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    login
  );

//logout route
router.get('/logout', logOut);

module.exports = router;
