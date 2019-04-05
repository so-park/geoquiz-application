/*
_id
type
id
properties
geometry
*/

const mongoose	= require('mongoose');

const CountrySchema = mongoose.Schema({

	type: String,
	properties: {
		name: [],
		id: String,
		capital: [],
		misspell_name: [],
		misspell_capital: [],
		continent: String,
		center: Array,
		code: String
	},
	geometry: {
		type: {type: String}, // type is used as the type of geometry, need to use this syntax!
		coordinates: { type: Array} // just in case!
	}
});

module.exports = mongoose.model('Country', CountrySchema);
