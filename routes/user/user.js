const router = require('express').Router();
const passport = require('../../passport');
const userController = require('../../controllers/userController');

router.route('/')
  .get(userController.getUser)
  .post(userController.signup);

router
  .route('/data')
  .get(isLoggedIn, userController.getUserProfileData);

router.post('/login', passport.authenticate('local'), userController.login);

router.post('/logout', userController.logout);

// router.post('/check', userController.checkPw);

router.post('/change', userController.changePw);

//  this route isn't currently being used - thought it might be useful for validating a user
router.get('/auth', function (req, res) {
  if (req.isAuthenticated())
    return res.send(true);
  res.send(false);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;