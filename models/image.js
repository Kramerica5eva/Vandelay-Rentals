const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  image: {
    data: Buffer,
    dataType: String
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;


//  Docu-sign docs and iamges may be easier to store in a server file system and just referenced in the DB