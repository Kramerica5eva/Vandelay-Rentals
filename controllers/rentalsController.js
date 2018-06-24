const db = require('../models');

// Defining methods for the rentalsController
module.exports = {
  findAll: function (req, res) {
    db.Rental
      .find({})
      .sort({ date: -1 })
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByCategory: function (req, res) {
    db.Rental
      .find({ category: req.params.category })
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Rental
      .findById(req.params.id)
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findbyDates: function (req, res) {
    db.Rental
      .find({ /* search parameters */ })
      .sort({ date: -1 })
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  makeReservation: function (req, res) {
    db.Rental
      .findOneAndUpdate({ _id: req.params.id },
        /* in place of 'req.body', functionality to remove a reservation */
        /* will also need to be removed from the user's document */
        req.body)
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  breakReservation: function (req, res) {
    dbRental
      .findOneAndUpdate({ _id: req.params.id },
        /* in place of 'req.body', functionality to remove a reservation */
        /* will also need to be removed from the user's document */
        req.body)
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
