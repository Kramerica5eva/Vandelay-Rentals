const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
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

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB