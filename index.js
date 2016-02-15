var Temp = require('./temperature.js');
var Database = require('./database.js');
var tmpRead = new Temp();
var lastTemperature = null;
var db = new Database();
var server = require('./server.js');

db.init();

function logTmp(data) {
	if(data !== lastTemperature) {
		lastTemperature = data;
		db.insert({date:new Date().getTime(), temperature: data});
		server.update(data);
	}
}

setInterval(tmpRead.readTemperature(logTmp), 100);
