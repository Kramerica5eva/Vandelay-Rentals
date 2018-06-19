const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  maker: String,
  sku: String,
  dailyRate: Schema.Types.Decimal128,
  reservations: [],
  timesRented: Number,
  dateAcquired: Date,
  condition: {
    type: String,
    enum: ['New', 'Working', 'Repair', 'Retired'],
    default: 'Good'
  },
  images: [{ filepath: String }]
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB