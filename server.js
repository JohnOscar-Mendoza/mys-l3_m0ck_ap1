// ./server.js
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');
var app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/layouts');

var auth = require('./routes/v1/auth');
app.use('/v1/auth', auth);

var grids = require('./routes/v1/grids');
app.use('/v1/grids', grids);

var serialized = require('./routes/v1/serialized');
app.use('/v1/serialized', serialized)
// Start Server

var os = require('os');
app.listen(3000, function(err) {

	console.log("Server running at "+os.hostname()+":3000");
});