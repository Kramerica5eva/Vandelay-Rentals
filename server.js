const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const session = require('express-session');
const dbConnection = require('./connection/connection');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
const PORT = process.env.PORT || 8080;
const db = require ('./models');


const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(methodOverride('_method'));

let gfs;

dbConnection.once('open', () => {
	gfs = Grid(dbConnection.db, mongoose.mongo);
	gfs.collection('images');
});

const storage = new GridFsStorage({
	url: dbConnection,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = fub.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'images'
				};
				resolve(fileInfo);
			});
		});
	}
});

const upload = multer({ storage });

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Sessions
app.use(
	session({
		cookie: { path: '/', httpOnly: true, maxAge: null },
		secret: 'bicycles and tricycles', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser

// app.post('/upload', upload.single('file-upload'), function (req, res, next) {
// 	console.log("Here's the upload req file:");
// 	console.log(req.file);
// 	db.Image.create(req.body).then(dbFile => {
// 		console.log(dbFile);
// 		res.json(dbFile)})
// 	.catch(err => res.status(422).json(err));
// });

app.get('/image', function (req, res) {
	db.Image.find({}).then(image => {
		res.json(image);
	});
});

//	the upload.single('name') should match whatever name you gave the input field in the html
app.post('/upload', upload.single('file-upload'), (req, res) => {
	res.json({ file: req.file });
});

// Add routes, both API and view
app.use(routes);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
