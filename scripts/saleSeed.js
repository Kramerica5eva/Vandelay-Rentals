const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Sales collection and inserts the sales below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

const saleSeed = [
  {
    name: 'Malibu Classic',
    category: 'Paddleboard',
    maker: 'Pau Hana',
    cost: 700.00,
    price: 600.00,
    sku: 'p-2017-44b-017',
    dateAcquired: '2017-06-15',
    saleType: 'Used',
    condition: 'Good'
  },
  {
    name: 'HD Gatorshell',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 1050.00,
    price: 1599.00,
    sku: 'p-2018-12a-007',
    dateAcquired: '2018-05-19',
    condition: 'New'
  },
  {
    name: 'Flood Gatorshell',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 800.00,
    price: 1199.00,
    sku: 'p-2018-22o-026',
    dateAcquired: '2018-05-19',
    condition: 'New'
  },
  {
    name: 'HD Aero',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 925.00,
    price: 1379.00,
    sku: 'p-2018-79p-011',
    dateAcquired: '2018-05-19',
    condition: 'New'
  },
  {
    name: 'Bark + prAna Aleka',
    category: 'Paddleboard',
    maker: 'Surftech',
    cost: 840.00,
    price: 850.00,
    sku: 'p-2017-67r-059',
    dateAcquired: '2017-03-15',
    saleType: 'Used',
    condition: 'Excellent'
  },
  {
    name: 'Alta Air-Travel',
    category: 'Paddleboard',
    maker: 'Surftech',
    cost: 540.00,
    price: 170.00,
    sku: 'p-2016-55m-028',
    dateAcquired: '2016-04-22',
    saleType: 'Used',
    condition: 'Fair'
  },
  {
    name: 'Bay ST Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    cost: 1100.00,
    price: 1650.00,
    sku: 'k-554-urq-14',
    dateAcquired: '2018-05-25',
    saleType: 'New',
    condition: 'New'
  },
  {
    name: 'Beach LT Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    cost: 840.00,
    price: 1200.00,
    sku: 'k-122-hrs-01',
    dateAcquired: '2018-05-25',
    saleType: 'New',
    condition: 'New'
  },
  {
    name: 'Columbia XP Two Tandem',
    category: 'Kayak',
    maker: 'Aquaglide',
    cost: 340.00,
    price: 350.00,
    sku: 'k-122-jor-055',
    dateAcquired: '2016-04-22',
    saleType: 'Used',
    condition: 'Good'
  },
  {
    name: 'Chinook XP One Inflatable',
    category: 'Kayak',
    maker: 'Aquaglide',
    cost: 175.00,
    price: 60.00,
    sku: 'k-404-inf-04',
    dateAcquired: '2016-04-22',
    saleType: 'Used',
    condition: 'Poor'
  },
  {
    name: 'Delta 14',
    category: 'Kayak',
    maker: 'Delta',
    cost: 1500.00,
    price: 2200.00,
    sku: 'k-909-hef-091',
    dateAcquired: '2018-05-16',
    saleType: 'New',
    condition: 'New'
  },
];

db.Sale
  .remove({})
  .then(() => db.Sale.collection.insertMany(saleSeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });