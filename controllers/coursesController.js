const db = require('../models');

// Defining methods for the coursesController
module.exports = {
  findAll: function (req, res) {
    db.Course
      .find({})
      .sort({ date: -1 })
      .then(dbModel => {
        let coursesArray = [];
        //  removing participants names from public routes
        for (let i = 0; i < dbModel.length; i++) {
          const element = dbModel[i];
          const courseObject = {
            _id: element._id,
            name: element.name,
            price: element.price,
            abstract: element.abstract,
            detail: element.detail,
            topics: element.topics,
            level: element.level,
            date: element.date,
            slots: element.slots - element.participants.length
          }
          coursesArray.push(courseObject);
        };
        res.json(coursesArray);
      })
      .catch(err => res.status(422).json(err));
  },

  findById: function (req, res) {
    db.Course
      .findById(req.params.id)
      .then(dbModel => {

        //  functionality to limit what info gets sent to users

        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },

  update: function (req, res) {
    db.Course
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => {

        //  functionality to limit what info gets sent to users

        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
};
