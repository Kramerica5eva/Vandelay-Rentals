const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.promise = Promise;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  email: String,
	street: String,
	city: String,
	state: String,
	zipcode: Number,
  phone: Number,
  waivers: [{
    filepath: String,
    signed: Boolean
  }]
});

// Define schema methods
userSchema.methods = {
	checkPassword: function (inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password);
	},
	hashPassword: plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10);
	}
}

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
	if (!this.password) {
		console.log('models/user.js =======NO PASSWORD PROVIDED=======');
		next();
	} else {
		console.log('models/user.js hashPassword in pre save');
		
		this.password = this.hashPassword(this.password);
		next();
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB