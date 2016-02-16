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
			lastTemperature = data;
			db.insert({date:new Date().getTime(), temperature: data}, function() {});
			server.update(data);
		}
	}.bind(this));
}.bind(this), 10000);
