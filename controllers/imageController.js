const db = require('../models');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const dbConnection = require('../connection/connection');

dbConnection.once('open', () => {
  gfs = Grid(dbConnection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/vandelay_rental';
// const conn = mongoose.createConnection(mongoURI);
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// Defining methods for the imageController
module.exports = {

  findAll: function (req, res) {
    db.Rental.findOne({ _id: req.params.id })
      .then(rental => {
        console.log(rental.images);
        gfs.files.find({
          _id: { $in: rental.images }
        }).toArray((err, files) => {
          console.log(files);
          res.send(files);
        })
      })
  },

  create: function (req, res) {
    console.log("Here's the uploaded image data:");
    console.log(req.file);
    db.Rental.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { images: req.file.id } },
      { new: true }
    ).then(file => {
      console.log(file);
      res.json(file);
    })
  },


  findById: function (req, res) {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists"'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  },

  remove: function (req, res) {
    console.log("Delete route active...");
    console.log(`Rental _id: `);
    console.log(req.params.rental);
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) return res.status(404).json({ err: err });
      db.Rental.findOneAndUpdate(
        { _id: req.params.rental },
        { $pull: { images: req.params.id } },
        { new: true }
      ).then(rental => {
        res.json(rental);
      })
    });
  }
};
