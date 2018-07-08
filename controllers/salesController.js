const db = require('../models');

// Defining methods for the salesController
module.exports = {

  findAll: function (req, res) {
    db.Sale
      .find({})
      .then(dbModel => {
        console.log(dbModel);
        const salesArray = filterSalesItemData(dbModel);
        res.json(salesArray);
      })
      .catch(err => res.status(422).json(err));
  },

  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findByCategory: function (req, res) {
  //   db.Sale
  //     .find({ category: req.params.category })
  //     .then(dbModel => {
  //       console.log(dbModel);
  //       const salesArray = filterSalesItemData(dbModel);
  //       res.json(salesArray);
  //     })
  //     .catch(err => res.status(422).json(err));
  // },

  //  NOT YET BEING USED - DELETE IF UNUSED IN FINAL PRODUCT
  // findById: function (req, res) {
  //   db.Sale
  //     .findById(req.params.id)
  //     .then(dbModel => {
  //       console.log(dbModel);

  //       //  functionality to limit what info gets sent to users

  //       res.json(dbModel);
  //     })
  //     .catch(err => res.status(422).json(err));
  // },

};


function filterSalesItemData(dbModel) {
  //  filter out records of items already sold
  const tempDbModel = dbModel.filter(each => (each.status !== 'Sold'));
  let salesArray = [];
  //  removing merchant data (e.g. cost, condition) from public routes
  for (let i = 0; i < tempDbModel.length; i++) {
    const element = tempDbModel[i];
    const saleObject = {
      _id: element._id,
      name: element.name,
      category: element.category,
      maker: element.maker,
      price: element.price,
      saleType: element.saleType,
      status: element.status
    }
    salesArray.push(saleObject);
  }
  return salesArray;
}