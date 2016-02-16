var Temp = require('./temperature.js');
var Database = require('./database.js');
var tmpRead = new Temp();
var lastTemperature = null;
var db = new Database();
var server = require('./server.js');

db.init();

setInterval(function() {
	tmpRead.readTemperature(function(data) {
		if(data !== lastTemperature) {
			console.log("temp change from " + lastTemperature + " to " + data);
			lastTemperature = data;
			db.insert({date:new Date().getTime(), temperature: data}, function() {});
			server.update(data);
		}
	}.bind(this));
}.bind(this), 1000);
