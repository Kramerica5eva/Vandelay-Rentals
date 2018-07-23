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
    reservations: [],
    pastRentals: [],
    timesRented: 22,
    dateAcquired: 1492257600,
    condition: 'Good',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/BIC_Sport_Tough_Tec_11_cut_zpsd4zs2729.png",
    type: "rental"
  },
  {
    name: 'Malibu Classic',
    category: 'Paddleboard',
    maker: 'Pau Hana',
    sku: 'p-2018-89k-004',
    dailyRate: 22.00,
    reservations: [],
    pastRentals: [],
    timesRented: 0,
    dateAcquired: 1525435200,
    condition: 'New',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Pau_Hana_Malibu_Classic_10-6_cut_zps65tjiw3v.png",
    type: "rental"
  },
  {
    name: 'HD Aero',
    category: 'Paddleboard',
    maker: 'Bote',
    sku: 'p-2018-79p-011',
    dailyRate: 32.00,
    reservations: [],
    pastRentals: [],
    timesRented: 6,
    dateAcquired: 1492257600,
    condition: 'Good',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/BOT_HD_AERO_11-6_cut_zpsdt4xf4iv.png",
    type: "rental"
  },
  {
    name: 'Bark + prAna Aleka',
    category: 'Paddleboard',
    maker: 'Surftech',
    sku: 'p-2018-67r-059',
    dailyRate: 29.00,
    reservations: [],
    pastRentals: [],
    timesRented: 33,
    dateAcquired: 1525435200,
    condition: 'Working',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Surftech_Bark_prAna_Aleka_11-2_cut_zpsp39detpm.png",
    type: "rental"
  },
  {
    name: 'Bay ST Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    sku: 'k-554-urq-14',
    dailyRate: 45.00,
    reservations: [],
    pastRentals: [],
    timesRented: 112,
    dateAcquired: 1464868800,
    condition: 'Disrepair',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Oru_Kayak_Bay_ST_Folding_cut_zpsojlgvlbi.png",
    type: "rental"
  },
  {
    name: 'Beach LT Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    sku: 'k-122-hrs-01',
    dailyRate: 38.00,
    reservations: [],
    pastRentals: [],
    timesRented: 87,
    dateAcquired: 1464868800,
    condition: 'Working',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Oru_Kayak_Beach_LT_Folding_Kayak_cut_zpszznkhest.png",
    type: "rental"
  },
  {
    name: 'Unison 136T Tandem',
    category: 'Kayak',
    maker: 'Pelican Premium',
    sku: 'k-404-kov-07',
    dailyRate: 32.00,
    reservations: [],
    pastRentals: [],
    timesRented: 24,
    dateAcquired: 1464868800,
    condition: 'Good',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Pelican_Premium_Unison_136T_Tandem_Kayak_cut_zpsm5w6gdb5.png",
    type: "rental"
  },
  {
    name: 'Catch 120',
    category: 'Kayak',
    maker: 'Pelican Premium',
    sku: 'k-212-aja-118',
    dailyRate: 34.00,
    reservations: [],
    pastRentals: [],
    timesRented: 79,
    dateAcquired: 1464868800,
    condition: 'Working',
    images: [],
    displayImageUrl: "http://i1174.photobucket.com/albums/r619/vandelay-rentals/Pelican_Premium_Catch_120_Kayak_cut_zpsxxlozrzl.png",
    type: "rental"
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