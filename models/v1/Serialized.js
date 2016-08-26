// ./models/v1/Serialized.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Assume that the graph type is sent from the Core Api
var SerializedSchema = new mongoose.Schema({

	is_removed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now() },
	layout_id: [ { type: Schema.Types.ObjectId, ref: 'layouts' } ]
});

var Serialized = mongoose.model('serialized', SerializedSchema);
module.exports = Serialized;