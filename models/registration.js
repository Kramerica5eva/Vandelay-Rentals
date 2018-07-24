const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId
  },
  price: Schema.Types.Decimal128,
  date: Number,
  courseName: String,
  customerId: {
    type: Schema.Types.ObjectId
  },
  firstName: String,
  lastName: String,
  paid: {
    type: Boolean,
    default: false
  },
  note: String,
  amtPaid: Schema.Types.Decimal128
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;