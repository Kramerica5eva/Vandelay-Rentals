const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Paddleboard', 'Kayak'],
    default: 'Kayak',
    required: true
  },
  maker: String,
  sku: String,
  dailyRate: Schema.Types.Decimal128,
  reservations: [{
    from: Date,
    to: Date
  }],
  pastRentals: [{
    customerId: Number,
    date: {
      from: Date,
      to: Date
    }
  }],
  timesRented: Number,
  dateAcquired: Date,
  condition: {
    type: String,
    enum: ['New', 'Good', 'Working', 'Disrepair', 'Retired'],
    default: 'Good'
  },
  images: [{ filepath: String }]
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB