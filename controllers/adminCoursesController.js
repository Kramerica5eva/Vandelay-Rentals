const db = require('../models');

// Defining methods for the adminCoursesController
module.exports = {
  findAll: function (req, res) {
    db.Course
      .find({})
      .populate("registrations")
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function (req, res) {
  //   db.Course
  //     .findById(req.params.id)
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
  create: function (req, res) {
    const { price } = req.body;
    if (price === "$") return res.send({ message: "$ only" })
    const formatPrice = price.split("").filter(char => /^[0-9.]+$/.test(char)).join("");
    req.body.price = formatPrice;
    console.log(req.body.price);
    db.Course
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Course
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  //  Exact same as update, but to a different collection
  //  Registration is a subset of Course and doesn't need its own controller for one or two functions
  updateRegistration: function (req, res) {
    db.Registration
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // All of this will be greatly simplified by storing the cart in a cookie/localStorage/state
  //  If cookie or localStorage, we'll need to add functionality to check if a course is still available before checkout.
  remove: function (req, res) {
    db.TempRegistration.find({ courseId: req.params.id })
      .then(dbModel => {
        let promiseArray = [];
        for (let i = 0; i < dbModel.length; i++) {
          const element = dbModel[i];
          const cartQuery = db.ShoppingCart.find(
            { customerId: element.customerId },
            { $pull: { TempRegistrations: element._id } }
          )
          promiseArray.push(cartQuery)
          const tempRegQuery = db.TempRegistration.deleteOne(
            { courseId: req.params.id }
          )
          promiseArray.push(tempRegQuery)
        }
        promiseArray.push(
          db.Course
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
        )
        Promise.all(promiseArray)
          .then(values => res.json(values))
          .catch(err => res.json(err));

      }).catch(err => res.json(err));

  }
};
