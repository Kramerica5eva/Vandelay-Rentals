const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempRegistrationSchema = new Schema({
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

const TempRegistration = mongoose.model('TempRegistration', tempRegistrationSchema);

module.exports = TempRegistration;