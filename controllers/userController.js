const db = require('../models');

module.exports = {
  getUser: function (req, res) {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
      db.User.findOne({ _id: req.user._id })
        .then(response => {
          res.json(response);
        });
    } else {
      res.json({ user: null })
    }
  },

  signup: function (req, res) {
    const { username, firstName, lastName, email, state, zipcode, phone } = req.body;

    let zipTest = /^\d{5}(-\d{4})?$/.test(zipcode);
    let emailTest = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    let phoneTest = /^\d{3}[\-]\d{3}[\-]\d{4}/.test(phone);
    let userTest = /^[a-zA-Z0-9]+$/.test(username);
    let firstTest = /^[a-zA-Z]+$/.test(firstName);
    let lastTest = /^[a-zA-Z]+$/.test(lastName);
    let stateTest = /^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/.test(state);

    console.log(zipTest);
    console.log(emailTest);
    console.log(phoneTest);
    console.log(userTest);
    console.log(firstTest);
    console.log(lastTest);

    if (!zipTest || !emailTest || !phoneTest || !userTest || !firstTest || !lastTest || !stateTest) {
      console.log(zipTest);
      console.log(emailTest);
      console.log(phoneTest);
      console.log(userTest);
      console.log(firstTest);
      console.log(lastTest);
      return res.json({ error: 'did not validate' });
    }

    // ADD VALIDATION
    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log('User.js post error: ', err)
      } else if (user) {
        res.json({ error: 'username taken' });
      } else {
        db.User.findOne({ email: email }, (err, nextUser) => {
          if (err) {
            console.log('User.js post error: ', err)
          } else if (nextUser) {
            res.json({ error: 'email taken' })
          }
          else {
            const newUser = new db.User(req.body)
            newUser.save((err, savedUser) => {
              if (err) return res.json(err)
              console.log("User returned from login:");
              console.log(savedUser);
              console.log("User from req.user");
              console.log(req.user);

              db.ShoppingCart.create({
                customerId: savedUser._id
              })

              res.json(savedUser)
            })
          }
        })
      }
    })
  },

  login: function (req, res) {
    const { username } = req.body;

    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log("Stupid!");
        res.json(err);
      } else {
        res.json(user);
      }
    });
  },

  logout: function (req, res) {
    console.log("Hi! Here's your user: ");
    console.log(req.user);
    if (req.user) {
      req.session.destroy();
      res.send({ msg: 'logging out' })
    } else {
      res.send({ msg: 'no user to log out' })
    }
  },

  checkPw: function (res, req) {
    console.log(req.body);
    db.User.checkPassword(req.body)
      .then(res => {
        res.json(res);
      })
  },

}
