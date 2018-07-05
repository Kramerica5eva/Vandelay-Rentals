const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  price: Schema.Types.Decimal128,
  abstract: String,
  detail: String,
  topics: [{ type: String }],
  level: {
    type: String,
    enum: ['Advanced', 'Intermediate', 'Beginner'],
    default: 'Beginner'
  },
  date: Number,
  slots: Number,
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;