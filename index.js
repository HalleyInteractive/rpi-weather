var Temp = require('./temperature.js');
var Database = require('./database.js');
var tmpRead = new Temp();
var lastTemperature = null;
var db = new Database();
var server = require('./server.js');

db.init();

setInterval(readTemperature.bind(this), 10000);

/**
* Reads the temperature value from the module
*/
function readTemperature() {
	tmpRead.readTemperature(checkTemperatureReading.bind(this));
}

/**
* Checks if temeperature is different from last reading.
* Saves reading if needed
* @param {object} data Temperature reading including date and temperature
*/
function checkTemperatureReading(data) {
	if(data !== lastTemperature) {
		lastTemperature = data;
		db.insert({date:new Date().getTime(), temperature: data}, function() {});
		server.update(data);
	}
}
