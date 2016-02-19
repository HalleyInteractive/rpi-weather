var router = require('express').Router();
var db = require('./database.js');
var millisecondsInDay = 60*60*24*1000;

db.init();

/**
* Standard API route, returns last database entry
*/
router.get('/', function (req, res) {
	db.getLastEntry(function(row) {
		res.json(row);
	});
});

/**
* Get temperatures in a range from start to end date
* @param :startDate {int} Start date
* @param :endDate {int} End date
*/
router.get('/:startDate/:endDate', function(req, res) {
	db.get(req.params.startDate, req.params.endDate,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get max and min temperature recorded
*/
router.get('/extremes', function(req, res) {
	db.extremes(null, null,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get extremes in a range from start to end date
* @param :startDate {int} Start date
* @param :endDate {int} End date
*/
router.get('/extremes/:startDate/:endDate', function(req, res) {
	db.extremes(req.params.startDate, req.params.endDate,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from today
*/
router.get('/today', function(req, res) {
	var now = new Date();
	var millisecondsToday = ((now.getHours() * 60 * 60) +
	(now.getMinutes() * 60) + now.getSeconds()) * 1000;

	db.get(now.getTime() - millisecondsToday - 1000, now.getTime(),
	function(rows, test) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from this week
*/
router.get('/week', function(req, res) {
	var now = new Date();
	var millisecondsToday = ((now.getHours() * 60 * 60) +
	(now.getMinutes() * 60) + now.getSeconds()) * 1000;

	db.get(now.getTime() - millisecondsToday - (millisecondsInDay * 6),
	now.getTime(), function(rows) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from the last 24 hours
*/
router.get('/24hours', function(req, res) {
	var now = new Date();
	db.get(now.getTime() - millisecondsInDay, now.getTime(),
	function(rows) {
		res.json(rows);
	});
});

module.exports = router;
