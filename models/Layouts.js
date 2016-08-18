// ./models/Layouts.js

var mongoose = require('mongoose');

/*
	{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
	{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 1, h: 2}

*/

var LayoutsSchema = new mongoose.Schema({
	x: { type: Number, required: true},
	y: { type: Number, required: true },
	w: { type: Number, required: true },
	h: { type: Number, required: true },
	minW: { type: Number },
	maxW: { type: Number },
	is_static: { type: Boolean, default: false },
	is_removed: { type: Boolean, default: false }
});

// var Todo = 

module.exports = mongoose.model('layouts', LayoutsSchema);