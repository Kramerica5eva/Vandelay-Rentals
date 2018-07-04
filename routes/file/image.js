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

// Matches with '/file/image'
router.route('/names/:id')
  .get(isAdmin, imageController.findAll);

router.route('/:filename')
  .get(isAdmin, imageController.findById);

// Matches with '/file/image//:id'
router
  .route('/:id')
  .post(isAdmin, upload.single('file'), imageController.create)
  .delete(isAdmin, imageController.remove);

function isAdmin(req, res, next) {
  if (req.user.admin)
    return next();
  res.json({ isAuthenticated: false });
}

module.exports = router;
