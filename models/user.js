const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  phone: Number,
  waivers: [{
    filepath: String,
    signed: Boolean
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB