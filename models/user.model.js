/*
_id
type
id
properties
geometry
*/

const mongoose	= require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10
const UserSchema = mongoose.Schema({

	userId: {
    type: String,
    trim: true,
    required: true
  },
  userName: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }

});




module.exports = mongoose.model('User', UserSchema);
