var Temp = require('./../temperature.js');
var tmpRead = new Temp();



describe("Temperature class", function() {

	describe("getTemperatureValue", function() {

	    it("returns a temperature value", function(done) {
				var mockValue1 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=22875";
	      var temperature1 = tmpRead.getTemperatureValue(mockValue1);
				expect(temperature1).toBe("22875");
	      done();
	    });

			it("returns a temperature value", function(done) {
				var mockValue2 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=235235346";
	      var temperature2 = tmpRead.getTemperatureValue(mockValue2);
				expect(temperature2).toBe("235235346");
	      done();
	    });

			it("returns a temperature value", function(done) {
				var mockValue3 = "6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=6456 6e 01 55 00 7f ff 0c 10 90 : crc=90 YES 6e 01 55 00 7f ff 0c 10 90 t=22875";
	      var temperature3 = tmpRead.getTemperatureValue(mockValue3);
				expect(temperature3).toBe("6456");
	      done();
	    });

			it("returns undefined", function(done) {
				var mockValue4 = "6e 01 55";
	      var temperature4 = tmpRead.getTemperatureValue(mockValue4);
				expect(temperature4).toBe(undefined);
	      done();
	    });

	  });

		describe("getCelciusValue", function() {

		    it("Returns celcius round down", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34449);
					expect(celcius1).toBe("34.4");
		      done();
		    });

				it("Returns celcius round up", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34451);
					expect(celcius1).toBe("34.5");
		      done();
		    });

				it("Returns celcius fixed decimals", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(34000);
					expect(celcius1).toBe("34.0");
		      done();
		    });

				it("Returns celcius fixed decimals", function(done) {
		      var celcius1 = tmpRead.getCelciusValue(-2300);
					expect(celcius1).toBe("-2.3");
		      done();
		    });

		});

		describe("readTemperature", function() {

		    it("Returns value from file", function(done) {
		      tmpRead.readTemperature(function(temperature) {
						expect(temperature).toBe("22.9");
						done();
					},'spec/test_assets/1wire_mock_1.txt');
		    });

		});



});
