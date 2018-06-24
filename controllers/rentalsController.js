const db = require('../models');

// Defining methods for the rentalsController
module.exports = {

  findAll: function (req, res) {
    db.Rental
      .find({})
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
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
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
      .then(dbModel => {
        const rentalArray = filterRentalItemData(dbModel);
        res.json(rentalArray);
      })
      .catch(err => res.status(422).json(err));
  },

  makeReservation: function (req, res) {
    db.Rental
      .findOneAndUpdate({ _id: req.params.id },
        /* in place of 'req.body', functionality to remove a reservation */
        /* will also need to be removed from the user's document */
        req.body)
      .then(dbModel => {
        console.log(dbModel);

        //  functionality to limit what info gets sent to users

        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },

  breakReservation: function (req, res) {
    dbRental
      .findOneAndUpdate({ _id: req.params.id },
        /* in place of 'req.body', functionality to remove a reservation */
        /* will also need to be removed from the user's document */
        req.body)
      .then(dbModel => {
        console.log(dbModel);

        //  functionality to limit what info gets sent to users

        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  }

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