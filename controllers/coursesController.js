const db = require('../models');

// Defining methods for the coursesController
module.exports = {
  findAll: function (req, res) {
    db.Course
      .find({})
      .sort({ date: -1 })
      .then(dbModel => {
        let coursesArray = [];
        //  removing registrations names from public routes
        for (let i = 0; i < dbModel.length; i++) {
          const element = dbModel[i];
          const courseObject = {
            _id: element._id,
            name: element.name,
            price: element.price,
            summary: element.summary,
            description: element.description,
            topics: element.topics,
            level: element.level,
            date: element.date,
            slots: element.slots - element.registrations.length,
            displayImageUrl: element.displayImageUrl
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

        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },

  checkSpace: function (req, res) {
    db.Course.findById(req.body.courseId)
      .populate("registrations")
      .then(dbModel => {
        if (dbModel.slots - dbModel.registrations.length > 0) {
          return res.send({ response: "space", info: dbModel });
        } else {
          return res.send({ response: "full", info: dbModel });
        }
      })
      .catch(err => res.json(err));
  },

  reserveCourse: function (req, res) {
    console.log(req.body);
    db.Registration.create(req.body)
      .then(registration => {
        Promise.all([
          db.Course.findOneAndUpdate(
            { _id: req.body.courseId },
            { $push: { registrations: registration._id } },
            { new: true }
          ),
          db.User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { registrations: registration._id } },
            { new: true }
          ),
          db.ShoppingCart.findOneAndUpdate(
            { customerId: req.user._id },
            { $pull: { tempRegistrations: req.params.id } },
            { new: true }
          ),
          db.TempRegistration.deleteOne(
            { _id: req.params.id }
          ),
        ])
          .then(() => {
            return res.send({ response: "Success!" })
          })
      })
      .catch(err => res.json(err));
  },

  removeCourseRegistration: function (req, res) {
    console.log("Here's the course req.body:")
    console.log(req.body);
    db.Registration
      .deleteOne({ _id: req.params.id })
      .then(() => {
        Promise.all([
          db.Course.findByIdAndUpdate(
            { _id: req.body.courseId },
            { $pull: { registrations: req.params.id } },
            { new: true }
          ),
          db.User.findByIdAndUpdate(
            { _id: req.body.customerId },
            { $pull: { registrations: req.params.id } },
            { new: true }
          )
        ])
          .then(values => {
            res.send({ values: values })
          })
      })
      .catch(err => res.status(422).json(err));
  }

};
