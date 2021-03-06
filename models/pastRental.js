const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pastRentalSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId
  },
  category: String,
  dailyRate: Schema.Types.Decimal128,
  itemName: String,
  customerId: {
    type: Schema.Types.ObjectId
  },
  firstName: String,
  lastName: String,
  date: {
    from: Number,
    to: Number
  },
  paid: {
    type: Boolean,
    default: true
  },
  amtPaid: Schema.Types.Decimal128,
  images: [{
    type: Schema.Types.ObjectId
  }],
  note: String
});

const PastRental = mongoose.model('PastRental', pastRentalSchema);

module.exports = PastRental;