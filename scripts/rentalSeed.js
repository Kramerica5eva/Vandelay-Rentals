const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Rentals collection and inserts the rentals below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

const rentalSeed = [
  {
    name: 'Tough-Tec',
    category: 'Paddleboard',
    maker: 'BIC Sport',
    sku: 'p-2017-66b-002',
    dailyRate: 20.00,
    reservations: [
      { from: '2018-07-17', to: '2018-07-19' },
      { from: '2018-07-14', to: '2018-07-15' }
    ],
    pastRentals: [],
    timesRented: 22,
    dateAcquired: '2017-06-25',
    condition: 'Good',
    images: []
  },
  {
    name: 'Malibu Classic',
    category: 'Paddleboard',
    maker: 'Pau Hana',
    sku: 'p-2018-89k-004',
    dailyRate: 22.00,
    reservations: [
      { from: '2018-07-23', to: '2018-07-25' },
      { from: '2018-08-07', to: '2018-08-09' },
      { from: '2018-09-22', to: '2018-09-26' },
      { from: '2018-09-11', to: '2018-09-14' }
    ],
    pastRentals: [],
    timesRented: 0,
    dateAcquired: '2018-06-15',
    condition: 'New',
    images: []
  },
  {
    name: 'HD Aero',
    category: 'Paddleboard',
    maker: 'Bote',
    sku: 'p-2018-79p-011',
    dailyRate: 32.00,
    reservations: [
      { from: '2018-07-24', to: '2018-07-26' },
      { from: '2018-08-22', to: '2018-08-25' }
    ],
    pastRentals: [],
    timesRented: 6,
    dateAcquired: '2018-05-19',
    condition: 'Good',
    images: []
  },
  {
    name: 'Bark + prAna Aleka',
    category: 'Paddleboard',
    maker: 'Surftech',
    sku: 'p-2018-67r-059',
    dailyRate: 29.00,
    reservations: [
      { from: '2018-07-25', to: '2018-07-25' },
      { from: '2018-08-08', to: '2018-08-12' },
      { from: '2018-09-01', to: '2018-09-05' }
    ],
    pastRentals: [],
    timesRented: 33,
    dateAcquired: '2017-03-15',
    condition: 'Working',
    images: []
  },
  {
    name: 'Bay ST Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    sku: 'k-554-urq-14',
    dailyRate: 45.00,
    reservations: [
      { from: '2018-07-27', to: '2018-07-27' },
      { from: '2018-08-02', to: '2018-08-05' }
    ],
    pastRentals: [],
    timesRented: 112,
    dateAcquired: '2016-09-15',
    condition: 'Disrepair',
    images: []
  },
  {
    name: 'Beach LT Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    sku: 'k-122-hrs-01',
    dailyRate: 38.00,
    reservations: [
      { from: '2018-07-22', to: '2018-07-22' },
      { from: '2018-07-25', to: '2018-07-28' },
      { from: '2018-09-01', to: '2018-09-05' }
    ],
    pastRentals: [],
    timesRented: 87,
    dateAcquired: '2017-03-15',
    condition: 'Working',
    images: []
  },
  {
    name: 'Unison 136T Tandem',
    category: 'Kayak',
    maker: 'Pelican Premium',
    sku: 'k-404-kov-07',
    dailyRate: 32.00,
    reservations: [
      { from: '2018-07-16', to: '2018-07-16' },
      { from: '2018-07-17', to: '2017-07-18' },
      { from: '2018-07-18', to: '2018-07-18' },
      { from: '2018-07-19', to: '2018-07-22' },
      { from: '2018-08-01', to: '2018-08-05' }
    ],
    pastRentals: [],
    timesRented: 24,
    dateAcquired: '2018-03-15',
    condition: 'Good',
    images: []
  },
  {
    name: 'Catch 120',
    category: 'Kayak',
    maker: 'Pelican Premium',
    sku: 'k-212-aja-118',
    dailyRate: 34.00,
    reservations: [
      { from: '2018-07-16', to: '2018-07-16' },
      { from: '2018-07-17', to: '2017-07-18' },
      { from: '2018-07-18', to: '2018-07-18' },
      { from: '2018-07-19', to: '2018-07-22' },
      { from: '2018-08-22', to: '2018-08-25' }
    ],
    pastRentals: [],
    timesRented: 79,
    dateAcquired: '2017-06-22',
    condition: 'Working',
    images: []
  }
];

db.Rental
  .remove({})
  .then(() => db.Rental.collection.insertMany(rentalSeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });