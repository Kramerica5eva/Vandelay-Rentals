const db = require('../models');

// Defining methods for the rentalsController
module.exports = {

  findAll: function (req, res) {
    db.Rental
      .find({})
      .populate("reservations")
      .sort({ date: -1 }) // this doesn't do anything for these, but leaving it in case we find a reason to sort by some other measure later
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
      .catch(err => res.status(422).json(err));
  },

  findByCategory: function (req, res) {
    db.Rental
      .find({ category: req.params.category })
      .populate("reservations")
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
      .catch(err => res.status(422).json(err));
  },

  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function (req, res) {
  //   db.Rental
  //     .findById(req.params.id)
  //     .then(dbModel =>

  //       //  functionality to limit what info gets sent to users

  //       res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },

  reserveRental: function (req, res) {
    console.log("Here's the rental req.body:")
    console.log(req.body);

    db.Reservation.create(req.body)
      .then(reservation => {

        Promise.all([
          db.Rental.findOneAndUpdate(
            { _id: req.body.itemId },
            { $push: { reservations: reservation._id } },
            { new: true }
          ), db.User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { reservations: reservation._id } },
            { new: true }
          ), db.ShoppingCart.findOneAndUpdate(
            { customerId: req.user._id },
            { $pull: { tempReservations: req.body._id } },
            { new: true }
          ), db.TempReservation.deleteOne(
            { _id: req.body._id }
          )
        ])
          .then(() => {
            return res.send({ response: "Success!" })
          })
      })
      .catch(err => res.json(err));
  },

  breakReservation: function (req, res) {

    db.Reservation
      .deleteOne({ _id: req.params.id })
      .then(() => {
        Promise.all([
          db.Rental.findByIdAndUpdate(
            { _id: req.body.itemId },
            { $pull: { reservations: req.params.id } },
            { new: true }
          ),
          db.User.findByIdAndUpdate(
            { _id: req.body.customerId },
            { $pull: { reservations: req.params.id } },
            { new: true }
          )
        ])
          .then(values => {
            res.send({ values: values })
          })
      })
      .catch(err => res.status(422).json(err));
  },

  remove: function (req, res) {
    db.Rental
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

};


function filterRentalItemData(dbModel) {
  let rentalArray = [];
  //  removing private data (e.g. sku, pastRentals) from public rental display
  for (let i = 0; i < dbModel.length; i++) {
    const element = dbModel[i];
    const rentalObject = {
      _id: element._id,
      name: element.name,
      category: element.category,
      maker: element.maker,
      dailyRate: element.dailyRate,
      reservations: element.reservations
    }
    rentalArray.push(rentalObject);
  }
  return rentalArray;
}