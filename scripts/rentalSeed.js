const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Rentals collection and inserts the rentals below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

// const rentalDates = [
//   { from: 1532088000, to: 1532390400 },
//   { from: 1532779200, to: 1532908800 },
//   { from: 1533297600, to: 1533513600 },
//   { from: 1533643200, to: 1533945600 },
//   { from: 1533902400, to: 1534118400 },
//   { from: 1533902400, to: 1534723200 },
//   { from: 1534334400, to: 1534723200 },
//   { from: 1536321600, to: 1536624000 },
//   { from: 1533902400, to: 1534204800 },
//   { from: 1536321600, to: 1536624000 }
// ]

// const rentalSeed = [
//   {
//     name: 'Tough-Tec',
//     category: 'Paddleboard',
//     maker: 'BIC Sport',
//     sku: 'p-2017-66b-002',
//     dailyRate: 20.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 22,
//     dateAcquired: 1492257600',
//     condition: 'Good',
//     images: []
//   },
//   {
//     name: 'Malibu Classic',
//     category: 'Paddleboard',
//     maker: 'Pau Hana',
//     sku: 'p-2018-89k-004',
//     dailyRate: 22.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 0,
//     dateAcquired: 1525435200',
//     condition: 'New',
//     images: []
//   },
//   {
//     name: 'HD Aero',
//     category: 'Paddleboard',
//     maker: 'Bote',
//     sku: 'p-2018-79p-011',
//     dailyRate: 32.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 6,
//     dateAcquired: 1492257600',
//     condition: 'Good',
//     images: []
//   },
//   {
//     name: 'Bark + prAna Aleka',
//     category: 'Paddleboard',
//     maker: 'Surftech',
//     sku: 'p-2018-67r-059',
//     dailyRate: 29.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 33,
//     dateAcquired: 1525435200',
//     condition: 'Working',
//     images: []
//   },
//   {
//     name: 'Bay ST Folding Kayak',
//     category: 'Kayak',
//     maker: 'Oru Kayak',
//     sku: 'k-554-urq-14',
//     dailyRate: 45.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 112,
//     dateAcquired: 1464868800',
//     condition: 'Disrepair',
//     images: []
//   },
//   {
//     name: 'Beach LT Folding Kayak',
//     category: 'Kayak',
//     maker: 'Oru Kayak',
//     sku: 'k-122-hrs-01',
//     dailyRate: 38.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 87,
//     dateAcquired: 1464868800',
//     condition: 'Working',
//     images: []
//   },
//   {
//     name: 'Unison 136T Tandem',
//     category: 'Kayak',
//     maker: 'Pelican Premium',
//     sku: 'k-404-kov-07',
//     dailyRate: 32.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 24,
//     dateAcquired: 1464868800',
//     condition: 'Good',
//     images: []
//   },
//   {
//     name: 'Catch 120',
//     category: 'Kayak',
//     maker: 'Pelican Premium',
//     sku: 'k-212-aja-118',
//     dailyRate: 34.00,
//     reservations: [],
//     pastRentals: [],
//     timesRented: 79,
//     dateAcquired: 1464868800',
//     condition: 'Working',
//     images: []
//   }
// ];

const rentalSeed = [
  {
    name: 'Tough-Tec',
    category: 'Paddleboard',
    maker: 'BIC Sport',
    sku: 'p-2017-66b-002',
    dailyRate: 20.00,
    reservations: [
    //   { from: 1532044800-64800, to:1532304000-64800 }, //subtracting 64800 normalizes all of the times to midnight on the morning of the desired date. 
    //   { from: 1532736000-64800, to:1532822400-64800 }  //it was easier to do this rather than recalculate all of the unix timestamps
    ],
    pastRentals: [],
    timesRented: 22,
    dateAcquired: 1492257600,
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
      // { from: 1532736000-64800, to:1532822400-64800 },
      // { from: 1533254400-64800, to:1533427200-64800 },
      // { from: 1533600000-64800, to:1533859200-64800 },
      // { from: 1533859200-64800, to:1534032000-64800 }
    ],
    pastRentals: [],
    timesRented: 0,
    dateAcquired: 1525435200,
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
      // { from: 1532736000-64800, to:1532822400-64800 },
      // { from: 1533859200-64800, to:1534636800-64800 }
    ],
    pastRentals: [],
    timesRented: 6,
    dateAcquired: 1492257600,
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
      // { from: 1532044800-64800, to:1532304000-64800 },
      // { from: 1533254400-64800, to:1533427200-64800 },
      // { from: 1534291200-64800, to:1534636800-64800 }
    ],
    pastRentals: [],
    timesRented: 33,
    dateAcquired: 1525435200,
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
      // { from: 1532736000-64800, to:1532822400-64800 },
      // { from: 1533859200-64800, to:1534032000-64800 }
    ],
    pastRentals: [],
    timesRented: 112,
    dateAcquired: 1464868800,
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
      // { from: 1532044800-64800, to:1532304000-64800 },
      // { from: 1533859200-64800, to:1534032000-64800 },
      // { from: 1536278400-64800, to:1536537600-64800 }
    ],
    pastRentals: [],
    timesRented: 87,
    dateAcquired: 1464868800,
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
      // { from: 1532736000-64800, to:1532822400-64800 },
      // { from: 1533254400-64800, to:1533427200-64800 },
      // { from: 1533859200-64800, to:1534118400-64800 },
      // { from: 1534291200-64800, to:1534636800-64800 },
      // { from: 1536278400-64800, to:1536537600-64800 }
    ],
    pastRentals: [],
    timesRented: 24,
    dateAcquired: 1464868800,
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
      // { from: 1533254400-64800, to:1533427200-64800 },
      // { from: 1533859200-64800, to:1534032000-64800 },
      // { from: 1534550400-64800, to:1534636800-64800 },
      // { from: 1536278400-64800, to:1536537600-64800 }
    ],
    pastRentals: [],
    timesRented: 79,
    dateAcquired: 1464868800,
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