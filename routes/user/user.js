const router = require('express').Router();
const passport = require('../../passport');
const userController = require('../../controllers/userController');


router.route('/')
  .get(userController.getUser)
  .post(userController.signup);

router.post('/login', passport.authenticate('local'), userController.login);

router.post('/logout', userController.logout);

router.get('/auth', function (req, res) {
  if (req.isAuthenticated())
    return res.send(true);
  res.send(false);
});

module.exports = router;