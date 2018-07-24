const db = require('../models');

// Defining methods for the adminSalesController
module.exports = {
  findAll: function(req, res) {
    db.Sale
      .find({})
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  
  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function(req, res) {
  //   db.Sale
  //     .findById(req.params.id)
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },

  create: function(req, res) {
    const { cost, price } = req.body;

    if (cost === "$" && price === "$") return res.send({ message: "cost & price $ only" })
    else if (cost === "$") return res.send({ message: "cost $ only" })
    else if (price === "$") return res.send({ message: "price $ only" })

    req.body.cost = cost.split("").filter(char => /^[0-9.]+$/.test(char)).join("");
    req.body.price = price.split("").filter(char => /^[0-9.]+$/.test(char)).join("");

    db.Sale
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  update: function(req, res) {
    db.Sale
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  remove: function(req, res) {
    db.Sale
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
