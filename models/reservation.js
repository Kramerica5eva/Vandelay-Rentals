const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
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
  },
  amtPaid: {
    type: Schema.Types.Decimal128,
    default: 0
  },
  total: Schema.Types.Decimal128,
  note: String

});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;