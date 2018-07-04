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

  //	Remove if testing doesn't work out
  testReservations: [{
    type: Schema.Types.ObjectId,
    ref: "Reservation"
  }],
  //	END remove if...

  pastRentals: [{
    customerId: String,
    date: {
      from: Number,
      to: Number
    }
  }],
  timesRented: Number,
  dateAcquired: Number,
  condition: {
    type: String,
    enum: ['New', 'Good', 'Working', 'Disrepair', 'Retired'],
    default: 'Good'
  },
  images: [{
    type: Schema.Types.ObjectId
  }]
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;