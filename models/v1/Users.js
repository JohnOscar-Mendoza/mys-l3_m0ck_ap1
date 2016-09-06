// ./models/v1/Grids.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Assume that the graph type is sent from the Core Api
var UsersSchema = new mongoose.Schema({

	is_removed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now() },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	grid_id: [ { type: Schema.Types.ObjectId, ref: 'grids' } ],
	first_name: { type: String, required: true },
	last_name: { type: String, required: true }

});

var Users = mongoose.model('users', UsersSchema);
module.exports = Users;