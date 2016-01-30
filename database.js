
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var Database = function() {
	var scope = this;
	this.databasefile = "weather.db";
	var db;
	var insertStatement;
	var selectStatement;

	this.init = function() {
		if(!fs.existsSync(scope.databasefile)) {
			var err = fs.writeFileSync(scope.databasefile, '', { flags: 'wx' });
			if(err) { console.log(err); }
		}
		db = new sqlite3.Database(scope.databasefile);
		this.createTable();
		insertStatement = db.prepare("INSERT INTO temperature (date, temperature) VALUES($date, $temperature)");
		selectStatement = db.prepare("SELECT date, temperature FROM temperature WHERE date >= $dateStart AND date <= $dateEnd");
	};

	this.createTable = function() {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS temperature (date NUM, temperature NUM)");
		});
	};

	this.insert = function(data, callback) {
		insertStatement.run({$date:data.date, $temperature:data.temperature}, function(err) {
    	if(err) { console.log(err); }
			callback(err);
		});
	};

	this.get = function(dateStart, dateEnd, callback) {
		selectStatement.all({$dateStart:dateStart, $dateEnd:dateEnd}, function(err, results) {
			if(err) { console.log(err); }
			callback(results);
  	});
	};

	this.extremes = function(dateStart, dateEnd, callback) {
		var extremes = {
			min: {},
			max: {}
		};

		var filterQuery = dateStart || dateEnd ? " WHERE" : "";
		if(dateStart) {
			filterQuery += " date >= " + dateStart.toString();
		}
		if(dateEnd) {
			if(dateStart) {
				filterQuery += " AND";
			}
			filterQuery += " date < " + dateEnd.toString();
		}

		db.get('SELECT date, MIN(temperature) as temperature FROM temperature' + filterQuery, function(err, row) {
			if(err) { console.log(err); }
			extremes.min = row;
			db.get('SELECT date, MAX(temperature) as temperature FROM temperature' + filterQuery, function(err, row) {
				if(err) { console.log(err); }
				extremes.max = row;
				callback(extremes);
			});
		});
	};

	this.getLastEntry = function(callback) {
		db.get('SELECT date, temperature FROM temperature ORDER BY date DESC LIMIT 1', function(err, row) {
			if(err) { console.log(err); }
			callback(row);
		});
	};

};

module.exports = Database;
