/*
_id
type
id
properties
geometry
*/

const mongoose	= require('mongoose');

const UserSchema = mongoose.Schema({

	userId: {
    type: String,
    trim: true,
    required: true
  },
  fullName: {
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
