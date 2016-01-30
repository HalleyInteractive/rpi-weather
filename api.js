

var express = require('express');
var Database = require('./database.js');
var db = new Database();
db.init();

var seconds_in_day = 60*60*24;

var Api = function() {
	var app = express();
	app.get('/', function (req, res) {
		db.getLastEntry(function(row) {
			res.json(row);
		});
	});

	app.get('/:start_date/:end_date', function(req, res) {
		db.get(req.params.start_date, req.params.end_date, function(rows) {
			res.json(rows);
		});
	});

	app.get('/extremes', function(req, res) {
		db.extremes(null, null, function(rows) {
			res.json(rows);
		});
	});

	app.get('/extremes/:start_date/:end_date', function(req, res) {
		db.extremes(req.params.start_date, req.params.end_date, function(rows) {
			res.json(rows);
		});
	});

	app.get('/today', function(req, res) {
		var now = new Date();
		var seconds_today = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds();
		db.get(now.getTime() - seconds_today, now.getTime(), function(rows) {
			res.json(rows);
		});
	});

	app.get('/week', function(req, res) {
		var now = new Date();
		var seconds_today = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds();
		db.get(now.getTime() - seconds_today - (seconds_in_day * 6), now.getTime(), function(rows) {
			res.json(rows);
		});
	});
	
	app.listen(3000);
};

module.exports = Api;
