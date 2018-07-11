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
    dateAcquired: 1497484800,
    saleType: 'Used',
    condition: 'Good',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Pau_Hana_Malibu_Classic_10-6_cut_zps65tjiw3v.png"
  },
  {
    name: 'HD Gatorshell',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 1050.00,
    price: 1599.00,
    sku: 'p-2018-12a-007',
    dateAcquired: 1526688000,
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/BOTE_HD_Gatorshell_10-6_cut_zpstvtr6wkp.png"
  },
  {
    name: 'Flood Gatorshell',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 750.00,
    price: 1199.00,
    sku: 'p-2018-22o-026',
    dateAcquired: 1526688000,
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/BOTE_Flood_Gatorshell_10-6_cut_zpshpdtrp7t.png"
  },
  {
    name: 'HD Aero',
    category: 'Paddleboard',
    maker: 'Bote',
    cost: 925.00,
    price: 1379.00,
    sku: 'p-2018-79p-011',
    dateAcquired: 1526688000,
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/BOT_HD_AERO_11-6_cut_zpsdt4xf4iv.png"
  },
  {
    name: 'Bark + prAna Aleka',
    category: 'Paddleboard',
    maker: 'Surftech',
    cost: 840.00,
    price: 850.00,
    sku: 'p-2017-67r-059',
    dateAcquired: 1489536000,
    saleType: 'Used',
    condition: 'Excellent',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Surftech_Bark_prAna_Aleka_11-2_cut_zpsp39detpm.png"
  },
  {
    name: 'Alta Air-Travel',
    category: 'Paddleboard',
    maker: 'Surftech',
    cost: 540.00,
    price: 170.00,
    sku: 'p-2016-55m-028',
    dateAcquired: 1461283200,
    saleType: 'Used',
    condition: 'Fair',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Surftech_Alta_Air-Travel_10_cut_zpswxqrx90t.png",
    status: 'Sold',
    finalPrice: 150.00
  },
  {
    name: 'Bay ST Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    cost: 1100.00,
    price: 1650.00,
    sku: 'k-554-urq-14',
    dateAcquired: 1527206400,
    saleType: 'New',
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Oru_Kayak_Bay_ST_Folding_cut_zpsojlgvlbi.png"
  },
  {
    name: 'Beach LT Folding Kayak',
    category: 'Kayak',
    maker: 'Oru Kayak',
    cost: 840.00,
    price: 1200.00,
    sku: 'k-122-hrs-01',
    dateAcquired: 1527206400,
    saleType: 'New',
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Oru_Kayak_Beach_LT_Folding_Kayak_cut_zpszznkhest.png"
  },
  {
    name: 'Columbia XP Two Tandem',
    category: 'Kayak',
    maker: 'Aquaglide',
    cost: 340.00,
    price: 350.00,
    sku: 'k-122-jor-055',
    dateAcquired: 1461283200,
    saleType: 'Used',
    condition: 'Good',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Aquaglide_Columbia_XP_Two_Tandem_Inflatable_cut_zps2wokuaot.png"
  },
  {
    name: 'Chinook XP One Inflatable',
    category: 'Kayak',
    maker: 'Aquaglide',
    cost: 175.00,
    price: 60.00,
    sku: 'k-404-inf-04',
    dateAcquired: 1461283200,
    saleType: 'Used',
    condition: 'Poor',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Aquaglide_Columbia_XP_One_Inflatable_cut_zpsnzeuyvez.png"
  },
  {
    name: 'Delta 14',
    category: 'Kayak',
    maker: 'Delta',
    cost: 1500.00,
    price: 2200.00,
    sku: 'k-909-hef-091',
    dateAcquired: 1526428800,
    saleType: 'New',
    condition: 'New',
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/Delta_Delta_14_Kayak_cut_zpsesbi1wjs.png"
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