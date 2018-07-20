const db = require('../models');
const bcrypt = require('bcryptjs');

// Defining methods for the adminUsersController
module.exports = {
  findAll: function (req, res) {
    db.User
      .find({})
      .populate('reservations')
      .populate('registrations')
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function (req, res) {
  //   db.User
  //     .findById(req.params.id)
  //     .populate('reservations')
  //     .populate('registrations')
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
  //  This function gets data from admin tables and updates the db
  update: function (req, res) {
    if (req.body.password) {
      const pw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
      req.body.password = pw;
    }
    db.User
      .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(dbModel => res.json({
        dbModel: dbModel,
        user: req.user
      }))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.User
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
