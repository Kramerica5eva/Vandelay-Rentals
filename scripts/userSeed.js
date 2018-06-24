const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const pw = bcrypt.hashSync("1234", bcrypt.genSaltSync(10), null);

// This file empties the User collection and inserts the users below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

const userSeed = [
  {
    username: "Strangebrewer",
    password: pw,
    firstName: "Keith",
    lastName: "Allmon",
    email: "BKAShambala@gmail.com",
    street: "830 N, 500 W, Apt #132",
    city: "Bountiful",
    state: "UT",
    zipcode: 84010,
    phone: 8018666301,
    admin: true
  },
  {
    username: "Nicknard",
    firstName: "Joe",
    lastName: "Dirt",
    email: "Dood@gmail.com",
    street: "123 Home St",
    city: "Bountiful",
    state: "UT",
    zipcode: 84010,
    phone: 1234567890,
    admin: false
  }
]

db.User
  .remove({})
  .then(() => db.User.collection.insertMany(userSeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });