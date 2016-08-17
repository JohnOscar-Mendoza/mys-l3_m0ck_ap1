// ./server.js
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/layouts');

var layouts = require('./routes/layouts');
app.use('/layouts', layouts);

// Start Server
app.listen(3000);
console.log("Server running at port 3000");