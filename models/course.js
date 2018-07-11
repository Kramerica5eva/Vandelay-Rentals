const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  price: Schema.Types.Decimal128,
  abstract: String,
  detail: String,
  topics: [],
  level: {
    type: String,
    enum: ['Advanced', 'Intermediate', 'Beginner'],
    default: 'Beginner'
  },
  date: Number,
  slots: Number,
  registrations: [{
    type: Schema.Types.ObjectId,
    ref: "Registration"
  }],
  displayImageUrl:String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;