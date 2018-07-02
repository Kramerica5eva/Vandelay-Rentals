const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const User = require('../models/user');

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ');
	console.log(user) // the whole raw user object!
	console.log('---------');
	done(null, {
		_id: user._id,
		username: user.username
	});
});

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	console.log('DeserializeUser called');
	User.findOne({ _id: id }).then(user => {
		if (user) done(null, user);
		else done({ error: "Error"}, null);
	}).catch(err => console.log(err));
});

//  Use Strategies 
passport.use(LocalStrategy);

module.exports = passport; 