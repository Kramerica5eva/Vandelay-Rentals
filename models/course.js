const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  price: Schema.Types.Decimal128,
  synopsis: String,
  level: {
    type: String,
    enum: ['Advanced', 'Intermediate', 'Beginner'],
    default: 'Beginner'
  },
  date: Date,
  slots: Number,
  participants: [{
    name: String, paid: Boolean
  }]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;