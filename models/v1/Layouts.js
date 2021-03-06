// ./models/v1/Layouts.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Assume that the graph type is sent from the Core Api
var LayoutsSchema = new mongoose.Schema({

	grid_id: { type: Schema.Types.ObjectId },
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	w: { type: Number, required: true },
	h: { type: Number, required: true },
	minW: { type: Number },
	maxW: { type: Number },
	is_static: { type: Boolean, default: false },
	is_removed: { type: Boolean, default: false },
	size: { type: String, default: 'lg', index: true },
	created_at: { type: Date, default: Date.now() }

});

LayoutsSchema.index({ grid_id: 1, size: 1 }, { unique: true });

var Layouts = mongoose.model('layouts', LayoutsSchema);
module.exports = Layouts;