const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true
  },
  maker: String,
  sku: String,
  dailyRate: Schema.Types.Decimal128,
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: "Reservation"
  }],
  pastRentals: [{
    type: Schema.Types.ObjectId,
    ref: "PastRental"
  }],
  timesRented: { type: Number, default: 0 },
  dateAcquired: Number,
  condition: {
    type: String,
    enum: ['New', 'Good', 'Working', 'Disrepair', 'Retired'],
    default: 'Good'
  },
  images: [{
    type: Schema.Types.ObjectId
  }],
  displayImageUrl: String,
  note: String,
  type: String
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;