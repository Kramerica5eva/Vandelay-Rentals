const db = require('../models');

module.exports = {
  getUser: function (req, res) {
    db.User.findOne({ username: req.user.username })
      .then(response => {
        res.json(response);
      });
    // console.log('===== user!!======')
    // console.log(req.user)
    // if (req.user) {
    //   res.json({ user: req.user })
    // } else {
    //   res.json({ user: null })
    // }
  },

  signup: function (req, res) {
    const { username } = req.body
    // ADD VALIDATION
    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log('User.js post error: ', err)
      } else if (user) {
        res.json({
          error: `Sorry, already a user with the username: ${username}`
        })
      }
      else {
        const newUser = new db.User(req.body)
        newUser.save((err, savedUser) => {
          if (err) return res.json(err)
          res.json(savedUser)
        })
      }
    })
  },

  login: function (req, res) {
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username
    };
    res.send(userInfo);
  },

  logout: function (req, res) {
    console.log("Hi! Here's your user: ");
    console.log(req.user);
    if (req.user) {
      console.log("Yep, there's a user.");
      req.session.destroy();
      res.send({ msg: 'logging out' })
    } else {
      res.send({ msg: 'no user to log out' })
    }
  }

}
