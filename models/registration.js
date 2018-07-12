const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
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
  }
});

const Registration = mongoose.model('Registration', RegistrationSchema);

module.exports = Registration;