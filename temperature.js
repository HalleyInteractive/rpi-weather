var fs = require('fs');

var Temperature = function() {

	var onewirePath = '/sys/bus/w1/devices/28-00047573c7ff/w1_slave';
	var scope = this;
	var temperatureRegex = new RegExp(/t=([0-9]+)/);

	this.getTemperatureValue = function(data) {
		if(temperatureRegex.test(data)) {
			var matches = data.match(temperatureRegex);
			if(matches.length > 1) {
				return matches[1];
			}
		}
		return undefined;
	};

	this.getCelciusValue = function(value) {
		return (Math.round(parseInt(value) / 100)/10).toFixed(1);
	};

	this.readTemperature = function(cb, path) {
		if(path === undefined) {
			path = onewirePath;
		}
		fs.readFile(path, 'utf8', function(err, data) {
			if(err) throw err;
			cb(scope.getCelciusValue(scope.getTemperatureValue(data)));
		});
	};

};

module.exports = Temperature;
