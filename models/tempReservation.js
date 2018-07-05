const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempReservationSchema = new Schema({
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
    default: false
  }
});

const TempReservation = mongoose.model('TempReservation', tempReservationSchema);

module.exports = TempReservation;