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
    customerId: String,
    date: {
      from: Number,
      to: Number
    }
  }],
  pastRentals: [{
    customerId: String,
    date: {
      from: Number,
      to: Number
    }
  }],
  timesRented: Number,
  dateAcquired: Date,
  condition: {
    type: String,
    enum: ['New', 'Good', 'Working', 'Disrepair', 'Retired'],
    default: 'Good'
  },
  images: [{
    _id: String
   }]
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;