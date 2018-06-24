const db = require('../models');

// Defining methods for the salesController
module.exports = {
  findAll: function(req, res) {
    db.Sale
      .find({})
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Sale
      .findById(req.params.id)
      .then(dbModel =>

        //  functionality to limit what info gets sent to users

        res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
