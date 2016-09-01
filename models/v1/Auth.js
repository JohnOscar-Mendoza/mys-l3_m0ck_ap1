// ./models/v1/Login.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthSchema = new mongoose.Schema({

	is_removed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now() },
	email: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true } 

});

var Auth = mongoose.model('Users', AuthSchema);
module.exports = Auth;