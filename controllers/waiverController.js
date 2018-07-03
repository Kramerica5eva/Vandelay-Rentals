const db = require('../models');
const hellosign = require('hellosign-sdk')({key: "885fe716760ad052c0df78878bd1aeb6f09292b59d82fe035888a457cc4c133a"}); // hellosign SDK in order to run hellosign api calls
// const hellosign = require('hellosign-sdk'); // hellosign-embeded version

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
    console.log("req hit");

    //captures the client's email and their name from the request.body
    const { clientEmail , clientName, clientId, apiKey } = req.body;

    // hellosign client id and key that are specified for our app (Vandelay Rental) on their site
    const options = {
      // key: "885fe716760ad052c0df78878bd1aeb6f09292b59d82fe035888a457cc4c133a", // our app api key
      clientId: "aaad4deadb45633d2cc5ebe07ed2eff2", // our app client id
      test_mode: 1, // test mode active, required for non-paid account and is not legally binding
      // client_id: "aaad4deadb45633d2cc5ebe07ed2eff2",
      subject: 'Waiver form to sign for Vandelay Rentals',
      template_id:"12dc7d7fea9cc74dcb2c2aeba0c1335053ca8785" ,
      message: 'Please sign and read this waiver in order to continue with the rental process.',
      signers: [
        {
          email_address: "email@email.com",//clientEmail, // passed from the deconstructed req.bode
          name: "john smith",//clientName, // passed from the deconstructed req.bode
          role: "client",
          order: 0
        }
      ],
      // cc_email_addresses: ['vandelayrentals@gmail.com'],
      // files could be possible source of api stoppage issue
      // files: [__dirname + 'static/assets/files/rentalWaiver.docx'] // !!!!!!! set up route with Waiver docx on server side
    };
    console.log(options);

    // creates a new signature request
    hellosign.signatureRequest.createEmbeddedWithTemplate(options)
    // signatureRequest.createEmbeddedWithTemplate({
    .then((data) => {
      console.log("Signature data: --->" + data);

      const firstSignature = data.signature_request.signatures[0];
      const signatureId = firstSignature.signature_id;

      console.log(hellosign.embedded.getSignUrl(signatureId));

      return hellosign.embedded.getSignUrl(signatureId);
      // embedded.getSignUrl(signatureId)
      })
      .then((response) => {
        console.log(response);

        res.json({
          success: true,
          data: {
            signUrl: response.embedded.sign_url
          }
        });
      })
    .catch((err) => {
      console.log(err);

      res.json({
        success: false
      });
    });
  }
};
