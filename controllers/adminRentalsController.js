const db = require('../models');

// Defining methods for the adminRentalsController
module.exports = {
  findAll: function (req, res) {
    db.Rental
      .find({})
      .populate("reservations")
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Rental
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getReservations: function (req, res) {
    db.Rental
      .findById({ _id: req.params.id })
      .populate("reservations")
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  updateReservation: function (req, res) {
    db.Reservation
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  finishReservation: function (req, res) {
    console.log("Here's the Reservation req.body:")
    console.log(req.body);
    db.PastRental
      .create(req.body)
      .then(dbModel => {
        
        Promise.all([
          db.User.findOneAndUpdate(
            { _id: req.body.customerId },
            {
              $pull: { reservations: req.body._id },
              $push: { pastRentals: dbModel._id }
            },
            { new: true }
          ), db.Rental.findOneAndUpdate(
            { _id: req.body.itemId },
            {
              $pull: { reservations: req.body._id },
              $push: { pastRentals: dbModel._id },
              $inc: { timesRented: 1 } /* if we add rental checkout functionality, this $inc should go there rather than here */
            },
            { new: true }
          ), db.Reservation.deleteOne(
            { _id: req.params.id }
          )
        ])
          .then(values => {
            return res.json({ values: values });
          })
          .catch(err => res.status(422).json(err));

      })
      .catch(err => res.status(422).json(err));
  },






  create: function (req, res) {
    db.Rental
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  update: function (req, res) {
    db.Rental
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Rental
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
