const db = require('../models');

// Defining methods for the adminRentalsController
module.exports = {
  findAll: function (req, res) {
    db.Rental
      .find({})
      .populate("reservations")
      .populate("pastRentals")
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function (req, res) {
  //   db.Rental
  //     .findById(req.params.id)
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // getReservations: function (req, res) {
  //   db.Rental
  //     .findById({ _id: req.params.id })
  //     .populate("reservations")
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
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

  //  Before removing a rental item, all references to it are found and removed:
  remove: function (req, res) {
    //  req.params.id = rental item id
    let queryArray = [
      db.TempReservation.remove({ itemId: req.params.id }),
      db.Reservation.remove({ itemId: req.params.id }),
      db.Rental.remove({ _id: req.params.id })
    ];

    // find all temporary reservations that match the rental item id
    db.TempReservation.find({ itemId: req.params.id })
      .then(tempRes => {

        for (let i = 0; i < tempRes.length; i++) {
          const element = tempRes[i];

          const cartQuery = db.ShoppingCart.update(
            { tempReservations: element._id },
            { $pull: {tempReservations: element._id} },
            { multi: true }
          )
          const userQuery = db.User.update(
            { tempReservations: element._id },
            { $pull: { tempReservations: element._id } },
            { multi: true }
          )
          queryArray.push(cartQuery);
          queryArray.push(userQuery);
        }
      }).then(() => {
        // find all reservations that match the rental item id
        db.Reservation.find({ itemId: req.params.id })
          .then(reservation => {

            // build a user query for each reservations and push it to the query array
            for (let i = 0; i < reservation.length; i++) {
              const element = reservation[i];

              const userResQuery = db.User.update(
                { reservations: element._id },
                { $pull: { reservations: element._id } },
                { multi: true }
              )

              // const userResQuery = db.User.update(
              //   { _id: element.customerId },
              //   { $pull: { reservations: element._id } }
              // )
              queryArray.push(userResQuery);
            }
          }).then(() => {
            // run the query array
            Promise.all(queryArray)
          })
          .then(response => res.send(response))
          .catch(err => res.status(422).json(err));
      })
  }

};
