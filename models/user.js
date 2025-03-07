const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // username & pass fields are auto generated when we use passportLocalMongoose .
});

userSchema.plugin(passportLocalMongoose); //It automatically handles hashing , salting and other auth stuff

module.exports = mongoose.model('User', userSchema);
