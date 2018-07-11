const db = require('../models');
const hellosign = require('hellosign-sdk')({key: "885fe716760ad052c0df78878bd1aeb6f09292b59d82fe035888a457cc4c133a"}); // hellosign SDK in order to run hellosign api calls

// Defining methods for the waiverController
module.exports = {
  findAll: function (req, res) {
    db.Course
      .find({})
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Course
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByCategory: function (req, res) {
    db.Course
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Course
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Course
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // hellosign-embeded
  createSignatureRequest: function (req, res) {

    //captures the client's email and their name from the request.body
    const { clientEmail , clientName } = req.body;

    // hellosign client id and key that are specified for our app (Vandelay Rental) on their site
    const options = {
      clientId: "aaad4deadb45633d2cc5ebe07ed2eff2", // our app client id
      test_mode: 1, // test mode active, required for non-paid account and is not legally binding
      subject: 'Waiver form to sign for Vandelay Rentals',
      template_id:"490bc3ea7078ff84da3e7fe13f919de766d1a743" ,
      message: 'Please sign and read this waiver in order to continue with the rental process.',
      signers: [
        {
          email_address: clientEmail, // passed from the deconstructed req.bode
          name: clientName, // passed from the deconstructed req.bode
          role: "client",
          order: 0
        }
      ],
    };

    hellosign.signatureRequest.createEmbeddedWithTemplate(options)

    .then((data) => {

      const firstSignature = data.signature_request.signatures[0];
      const signatureId = firstSignature.signature_id;

      return hellosign.embedded.getSignUrl(signatureId);
      })
      .then((response) => {
        res.json({
          success: true,
          data: {
            signUrl: response.embedded.sign_url
          }
        });
      })
    .catch((err) => {
      res.json({
        success: false
      });
    });
  }
};
