// ./models/v1/Grids.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Assume that the graph type is sent from the Core Api
var GridsSchema = new mongoose.Schema({

	is_removed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now() },
	layout_id: [ { type: Schema.Types.ObjectId, ref: 'layouts' } ]
});

var Grids = mongoose.model('grids', GridsSchema);
module.exports = Grids;