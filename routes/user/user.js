const router = require('express').Router();
const passport = require('../../passport');
const userController = require('../../controllers/userController');


  router.route('/')
    .get(userController.getUser)
    .post(userController.signup);

  router.post('/login', passport.authenticate('local'), userController.login);

  router.post('/logout', userController.logout);

  function isLoggedIn(req, res, next) {
    console.log('Ain\'t that some shit!');
    if (req.isAuthenticated())
      return next();
    res.redirect('/cgi');
  }



module.exports = router;