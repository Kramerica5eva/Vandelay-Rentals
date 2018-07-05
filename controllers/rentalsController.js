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

  //  this needs to be updated to move the reservation from temp to reservation
  makeReservation: function (req, res) {

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

    db.Reservation.create(reservationObject)
      .then(reservation => {

        Promise.all([db.Rental.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { testReservations: reservation._id } },
          { new: true }
        ), db.User.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { testReservations: reservation._id } },
          { new: true }
        )])
          .then(values => {
            return res.send({ response: "Success!" })
          })
      })
      .catch(err => res.json(err));
  },

  // makeReservation: function (req, res) {
  //   db.Rental
  //     .findOneAndUpdate({ _id: req.params.id },
  //       {
  //         $push: {
  //           reservations: {
  //             customerId: req.user._id,
  //             date: {
  //               from: parseInt(req.params.from),
  //               to: parseInt(req.params.to)
  //             }
  //           }
  //         }
  //       },
  //       { new: true }
  //     )
  //     .then(dbModel => {
  //       console.log(dbModel);

  //       //  functionality to limit what info gets sent to users

  //       res.json(dbModel);
  //     })
  //     .catch(err => res.status(422).json(err));
  // },

  breakReservation: function (req, res) {

    db.Reservation
      .deleteOne({ _id: req.params.id })
      .then(() => {
        Promise.all([
          db.Rental.findByIdAndUpdate(
            { _id: req.body.itemId },
            { $pull: { testReservations: req.params.id } },
            { new: true }
          ),
          db.User.findByIdAndUpdate(
            { _id: req.body.customerId },
            { $pull: { testReservations: req.params.id } },
            { new: true }
          )
        ])
          .then(narf => {
            res.send({ values: narf })
          })
      })

      // db.Rental
      //   .findOneAndUpdate({ _id: req.params.id },
      //     /* in place of 'req.body', functionality to remove a reservation */
      //     /* will also need to be removed from the user's document */
      //     req.body)
      //   .then(dbModel => {
      //     console.log(dbModel);

      //     //  functionality to limit what info gets sent to users

      //     res.json(dbModel);
      //   })
      .catch(err => res.status(422).json(err));
  },

  remove: function (req, res) {
    db.Course
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