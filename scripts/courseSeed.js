const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Course collection and inserts the courses below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vandelay_rental"
);

const courseSeed = [
  {
    name: 'Paddleboard Choir',
    price: 30.00,
    abstract: 'Learn how to sing while you paddle',
    detail: 'What better way to spend your day on the water than by annoying everyone around you with your "lovely" singing voice? Come hang out with us for an afternoon and learn how to lose friends and disinterest people. You *will* regret it.',
    topics: [
      'Tone control',
      'Multi-tasking',
      'Defensive stances',
      'Finding the right lawyer'
    ],
    level: 'Beginner',
    date: 1533196800,
    slots: 30,
    registrations: [],
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/paddleboard_choir_zpsk6ilp5ha.jpg"
  },
  {
    name: 'Whitewater Kayaking',
    price: 299.99,
    abstract: 'Learn how tie your shoes before driving to your kayaking launch.',
    detail: 'Never get caught with your shoes untied, espcially if you have a kayak with you. Disaster will ensue. Come spend the weekend with us with both your shoes tied and a big smile on your face.',
    topics: [
      'Calculus',
      'More multi-tasking',
      'Lederhosen',
      'Finding the right surgeon'
    ],
    level: 'Advanced',
    date: 1534932000,
    slots: 20,
    registrations: [],
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/essential_whitewater_kayaking_class_zpsj3flgx4v.jpg"
  },
  {
    name: 'Water Snipe Hunting',
    price: 135.00,
    abstract: 'Catch your very first snipe!',
    detail: 'Come on a snipe hunt with us. Learn the basics like how not to freeze to death by yourself in the wilderness when you get left behind as the last one to figure it out. Bring lots of money and a big box of tissues.',
    topics: [
      'Holding the bag',
      'Snipe calls',
      'Laughing at yourself',
      'How to take a joke'
    ],
    level: 'Intermediate',
    date: 1535810400,
    slots: 50,
    registrations: [],
    displayImageUrl:"http://i1174.photobucket.com/albums/r619/vandelay-rentals/water_snipe_hunt_zpsjr0tn1nu.jpg"
  }
];

db.Course
  .remove({})
  .then(() => db.Course.collection.insertMany(courseSeed))
  .then(data => {
    console.log(data.insertedCount + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });