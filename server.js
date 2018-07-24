const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const session = require('express-session');
const dbConnection = require('./connection/connection');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
const stripe = require("stripe")("sk_test_UqjD8ze31EPcfJMgmTPPLxmL");
const PORT = process.env.PORT || 8080;

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}
// added by NICK -- double check with KEITH. Is redundant? or needed in order to reach static in dev?
else {
	app.use(express.static('client/public'));
}

// Sessions
app.use(
	session({
		cookie: { path: '/', httpOnly: true, maxAge: null },
		secret: 'bicycles and tricycles', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: true, //required
		saveUninitialized: true //required
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser

// Stripe Example
// app.post("/charge", async (req, res) => {
// 	console.log("HERE IS THE CHARGE REQ")
// 	console.log(req.body)
// 	console.log(req.body.chrgAmt);
// 	console.log(req.body.token);
// 	try {
// 		let { status } = await stripe.charges.create({
// 			amount: req.body.chrgAmt,
// 			currency: "usd",
// 			description: "An example charge",
// 			source: req.body.token
// 		});

// 		res.json({ status });
// 	} catch (err) {
// 		res.status(500).end();
// 	}
// });

// Add routes
app.use(routes);

// Start the API server
app.listen(PORT, function () {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
