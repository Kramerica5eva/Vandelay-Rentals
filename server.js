const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const session = require('express-session');
const dbConnection = require('./connection/connection');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
const PORT = process.env.PORT || 8080;

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

// Add routes, both API and view
app.use(routes);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
