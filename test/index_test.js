var Temp = require('./../temperature.js');
var tmpRead = new Temp();
var assert = require('chai').assert;

describe("Temperature class", function() {

	describe("getTemperatureValue", function() {

	    it("returns a temperature value", function(done) {
				var mockValue1 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=22875";
	      var temperature1 = tmpRead.getTemperatureValue(mockValue1);
				assert.equal(temperature1, "22875");
	      done();
	    });

			it("returns a temperature value", function(done) {
				var mockValue2 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=235235346";
	      var temperature2 = tmpRead.getTemperatureValue(mockValue2);
				assert.equal(temperature2, "235235346");
	      done();
	    });

			it("returns a temperature value", function(done) {
				var mockValue3 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=6456 6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=22875";
	      var temperature3 = tmpRead.getTemperatureValue(mockValue3);
				assert.equal(temperature3, "6456");
	      done();
	    });

			it("returns undefined", function(done) {
				var mockValue4 = "6e 01 55";
	      var temperature4 = tmpRead.getTemperatureValue(mockValue4);
				assert.isUndefined(temperature4);
	      done();
	    });

	  });

		describe("getCelciusValue", function() {

		    it("Returns celcius round down", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34449);
					assert.equal(celcius1, "34.4");
		      done();
		    });

				it("Returns celcius round up", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34451);
					assert.equal(celcius1, "34.5");
		      done();
		    });

				it("Returns celcius fixed decimals", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34000);
					assert.equal(celcius1, "34.0");
		      done();
		    });

				it("Returns celcius fixed decimals", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(-2300);
					assert.equal(celcius1, "-2.3");
		      done();
		    });

		});

		describe("readTemperature", function() {

		    it("Returns value from file", function(done) {
		      tmpRead.readTemperature(function(temperature) {
						assert.equal(temperature, "22.9");
						done();
					},'test/assets/1wire_mock_1.txt');
		    });

		});



});
