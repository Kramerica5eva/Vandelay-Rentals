const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Course collection and inserts the courses below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

const categorySeed = [
  {
    category: 'Paddleboard',
    description: 'You keep using that word. I do not think it means what you think it means.'
  },
  {
    category: 'Kayak',
    description: 'Strange women lying in ponds distributing swords is no basis for a system of government'
  }
];

db.Category
  .remove({})
  .then(() => db.Category.collection.insertMany(categorySeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });