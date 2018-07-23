const router = require('express').Router();
const imageController = require('../../controllers/imageController');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/vandelay_rental';

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//  RENTAL IMAGE ROUTES
// Matches with '/file/image'
router.route('/names/:id')
  .get(isAdmin, imageController.findAllRentalImages);

// This route is called in the img tag src attribute
router.route('/:filename')
  .get(isAdmin, imageController.findImageById);

// Matches with '/file/image//:id'
// Uploading images to the database
router
  .route('/:id')
  .post(isAdmin, upload.single('file'), imageController.createRentalImage);

router
  .route('/:id/:rental')
  .delete(isAdmin, imageController.removeRentalImage);


//  PASTRENTAL IMAGE ROUTES
// Matches with '/file/image'
router.route('/past/names/:id')
  .get(isAdmin, imageController.findAllPastRentalImages);

// This route is called in the img tag src attribute
router.route('/past/:filename')
  .get(isAdmin, imageController.findImageById);

// Matches with '/file/image//:id'
// Uploading images to the database
router
  .route('/past/:id')
  .post(isAdmin, upload.single('file'), imageController.createPastRentalImage);

router
  .route('/past/:id/:rental')
  .delete(isAdmin, imageController.removePastRentalImage);

function isAdmin(req, res, next) {
  if (req.user.admin)
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
