const db = require('../models');
const dateFns = require("date-fns");

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

  findById: function (req, res) {
    db.Rental
      .findById(req.params.id)
      .then(dbModel => {
        console.log(dbModel);
        const rentalObject = {
          _id: dbModel._id,
          name: dbModel.name,
          category: dbModel.category,
          maker: dbModel.maker,
          dailyRate: dbModel.dailyRate,
          displayImageUrl: dbModel.displayImageUrl,
          reservations: dbModel.reservations
        }
        res.json(rentalObject)
      })
      .catch(err => res.status(422).json(err));
  },

  // getAllRentals = () => {
  //   API.getAllRentals()
  //     .then(res => {
  //       this.setState({
  //         rentals: res.data
  //       });
  //     })
  //     .catch(err => console.log(err));
  // }


  // reserveRental: function (req, res) {
  //   console.log("Shpoopy, here's the rental req.body:")
  //   console.log(req.body);
  //   db.Rental.findById(req.body.itemId)
  //     .then(dbModel => {
  //       console.log("start dbModel");
  //       console.log(dbModel);
  //       console.log("end dbModel");
  //       if (dbModel.reservations.length > 0) {
  //         for (let i = 0; i < dbModel.reservations.length; i++) {
  //           if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
  //             if (dbModel.reservations[i].date.from === req.body.date.from) {
  //               return res.send({ message: "already reserved" })
  //             }
  //           }
  //           if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
  //             if (dateFns.isWithinRange(dbModel.reservations[i].date.from, req.body.date.from, req.body.date.to)) {
  //               return res.send({ message: "already reserved" })
  //             }
  //           }
  //           if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
  //             if (dateFns.isWithinRange(req.body.date.from, dbModel.reservations[i].date.from, dbModel.reservations[i].date.to)) {
  //               return res.send({ message: "already reserved" })
  //             }
  //           }
  //           if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
  //             if (dateFns.areRangesOverlapping(dbModel.reservations[i].date.from, dbModel.reservations[i].date.to, req.body.date.from, req.body.date.to)) {
  //               return res.send({ message: "already reserved" })
  //             }
  //           }
  //         }
  //         db.Reservation.create(req.body)
  //           .then(reservation => {

  //             Promise.all([
  //               db.Rental.findOneAndUpdate(
  //                 { _id: req.body.itemId },
  //                 { $push: { reservations: reservation._id } },
  //                 { new: true }
  //               ), db.User.findOneAndUpdate(
  //                 { _id: req.user._id },
  //                 { $push: { reservations: reservation._id } },
  //                 { new: true }
  //               ), db.ShoppingCart.findOneAndUpdate(
  //                 { customerId: req.user._id },
  //                 { $pull: { tempReservations: req.body._id } },
  //                 { new: true }
  //               ), db.TempReservation.deleteOne(
  //                 { _id: req.body._id }
  //               )
  //             ])
  //               .then(() => {
  //                 return res.send({ message: "Successfully ran the IF gauntlet. " })
  //               })
  //           })
  //           .catch(err => res.json(err));
  //       } else {
  //         db.Reservation.create(req.body)
  //           .then(reservation => {

  //             Promise.all([
  //               db.Rental.findOneAndUpdate(
  //                 { _id: req.body.itemId },
  //                 { $push: { reservations: reservation._id } },
  //                 { new: true }
  //               ), db.User.findOneAndUpdate(
  //                 { _id: req.user._id },
  //                 { $push: { reservations: reservation._id } },
  //                 { new: true }
  //               ), db.ShoppingCart.findOneAndUpdate(
  //                 { customerId: req.user._id },
  //                 { $pull: { tempReservations: req.body._id } },
  //                 { new: true }
  //               ), db.TempReservation.deleteOne(
  //                 { _id: req.body._id }
  //               )
  //             ])
  //               .then(() => {
  //                 return res.send({ message: "Success! Skipped the IF gauntlet. " })
  //               })
  //           })
  //           .catch(err => res.json(err));
  //       }
  //     });
  // },

  finalCheck: function (req, res) {
    console.log("Here's the rental req.body: finalCheck")
    console.log(req.body);
    db.Rental.findById(req.body.itemId)
      .populate("reservations")
      .then(dbModel => {
        console.log("start dbModel finalCheck");
        console.log(dbModel);
        console.log("end dbModel finalCheck");

        console.log("Here come the reservations:finalCheck")
        console.log(dbModel.reservations);
        console.log("Here end the reservations.finalCheck")
        for (let i = 0; i < dbModel.reservations.length; i++) {
          if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
            if (dbModel.reservations[i].date.from === req.body.date.from) {
              return res.send({ response: "already reserved", info: dbModel })
            }
          }
          if (dbModel.reservations[i].date.from === dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
            if (dateFns.isWithinRange(dbModel.reservations[i].date.from, req.body.date.from, req.body.date.to)) {
              return res.send({ response: "already reserved", info: dbModel })
            }
          }
          if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from === req.body.date.to) {
            if (dateFns.isWithinRange(req.body.date.from, dbModel.reservations[i].date.from, dbModel.reservations[i].date.to)) {
              return res.send({ response: "already reserved", info: dbModel })
            }
          }
          if (dbModel.reservations[i].date.from !== dbModel.reservations[i].date.to && req.body.date.from !== req.body.date.to) {
            if (dateFns.areRangesOverlapping(dbModel.reservations[i].date.from, dbModel.reservations[i].date.to, req.body.date.from, req.body.date.to)) {
              return res.send({ response: "already reserved", info: dbModel })
            }
          }
        }
        // return res.send(true)
        return res.send({ response: "Success!", info: dbModel })
      }).catch(err => res.json(err));
  },

  reserveRental: function (req, res) {
    console.log("Here's the rental req.body:")
    console.log(req.body);
    db.Rental.findById(req.body.itemId)
      .populate("reservations")
      .then(dbModel => {
        console.log("start dbModel");
        console.log(dbModel);
        console.log("end dbModel");

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

      });
  },

  //   db.Reservation.create(req.body)
  //     .then(reservation => {

  //       Promise.all([
  //         db.Rental.findOneAndUpdate(
  //           { _id: req.body.itemId },
  //           { $push: { reservations: reservation._id } },
  //           { new: true }
  //         ), db.User.findOneAndUpdate(
  //           { _id: req.user._id },
  //           { $push: { reservations: reservation._id } },
  //           { new: true }
  //         ), db.ShoppingCart.findOneAndUpdate(
  //           { customerId: req.user._id },
  //           { $pull: { tempReservations: req.body._id } },
  //           { new: true }
  //         ), db.TempReservation.deleteOne(
  //           { _id: req.body._id }
  //         )
  //       ])
  //         .then(() => {
  //           return res.send({ response: "Success!" })
  //         })
  //     })
  //     .catch(err => res.json(err));
  // },

  breakReservation: function (req, res) {
    db.Reservation
      .deleteOne({ _id: req.params.id })
      .then(() => {
        Promise.all([
          db.Rental.findByIdAndUpdate(
            { _id: req.body.itemId },
            { $pull: { reservations: req.params.id } },
            { new: true }
          ), db.User.findByIdAndUpdate(
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
      reservations: element.reservations,
      displayImageUrl: element.displayImageUrl
    }
    rentalArray.push(rentalObject);
  }
  return rentalArray;
}