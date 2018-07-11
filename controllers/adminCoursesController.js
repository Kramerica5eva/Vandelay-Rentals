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
  remove: function (req, res) {
    db.Course
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
