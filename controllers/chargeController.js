const db = require('../models');
const stripe = require("stripe")("sk_test_UqjD8ze31EPcfJMgmTPPLxmL");

module.exports = {

  charge: function (req, res) {
    const token = req.body.token;
    const total = parseFloat(req.body.chrgAmt) * 100;

    const charge = stripe.charges.create({
      amount: total,
      currency: 'usd',
      description: 'res/reg charge',
      source: token
    });

    Promise.all([charge])
      .then((chargeResponse) => {
        res.json(chargeResponse);
      })
      .catch(err => console.log(err));
  },

  respaid: function (req, res) {
    db.Reservation.findOneAndUpdate(
      { _id: req.body.reservation._id },
      {
        paid: true,
        amtPaid: req.body.resTotal
      }
    ).then((resp) => {
      res.send("reservation paid");
    })
      .catch(err => console.log(err));
  },

  regpaid: function (req, res) {
    db.Registration.findOneAndUpdate(
      { _id: req.body.registration._id },
      {
        paid: true,
        amtPaid: req.body.regTotal
      }
    ).then((resp) => {
      res.send("registration paid");
    })
      .catch(err => console.log(err));
  }

}