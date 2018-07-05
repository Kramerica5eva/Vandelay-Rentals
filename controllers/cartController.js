const db = require('../models');

// Defining methods for the coursesController
module.exports = {
  findAll: function (req, res) {

  },

  findUserCart: function (req, res) {
    db.ShoppingCart.findOne({ customerId: req.user._id })
      .populate("tempRegistrations")
      .populate("tempReservations")
      .then(cart => res.json(cart))
      .catch(err => res.json(err));

  },

  addRegistrationToCart: function (req, res) {

    console.log("Course req.body:")
    console.log(req.body);

    const registrationObject = {
      courseId: req.params.id,
      courseName: req.body.name,
      customerId: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      price: req.body.price,
      date: req.body.date
    }

    db.TempRegistration.create(registrationObject)
      .then(registration => {
        console.log(registration)
        return db.ShoppingCart.findOneAndUpdate(
          { customerId: req.user._id },
          { $push: { tempRegistrations: registration._id } },
          { new: true }
        )
      })
      .then(cart => res.json(cart))
      .catch(err => res.json(err));
  },

  addReservationToCart: function (req, res) {

    console.log("Rental req.body:")
    console.log(req.body);

    const reservationObject = {
      itemId: req.params.id,
      itemName: req.params.name,
      customerId: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      dailyRate: parseFloat(req.body.dailyRate.$numberDecimal),
      date: {
        from: req.params.from,
        to: req.params.to
      }
    }

    db.TempReservation.create(reservationObject)
      .then(reservation => {
        console.log(reservation)
        return db.ShoppingCart.findOneAndUpdate(
          { customerId: req.user._id },
          { $push: { tempReservations: reservation._id } },
          { new: true }
        )
      })
      .catch(err => res.json(err));
  },

  update: function (req, res) {

  }

};