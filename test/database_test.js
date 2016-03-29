(function() {
  'use strict';

  let db = require('./../src/database.js');
  let settings = require('./../src/settings.js');
  let assert = require('chai').assert;

  settings.DATABASE_FILE = 'test_database.db';

  describe('Database', function() {

    describe('Insert tests', function(){
      describe('Temperature', function() {
    		it('Should add yesterdays temperature', function() {
    			db.init();
    		   return db.insertTemperature(settings.testValues.temperature.yesterday);
        });
        it('Should add todays temperature', function() {
          return db.insertTemperature(settings.testValues.temperature.today);
        });
    	});

      describe('Humidity', function() {
    		it('Should add yesterdays humidity', function() {
    			db.init();
    		   return db.insertHumidity(settings.testValues.humidity.yesterday);
        });
        it('Should add todays humidity', function() {
          return db.insertHumidity(settings.testValues.humidity.today);
        });
    	});
    });

    describe('Get entries tests', function() {
      describe('Temperature', function() {
      	it('Yesterday\'s and today\'s temperature should be returned',
        function(done) {
      		db.getTemperature({
            dateStart: settings.testValues.temperature.yesterday.date - 1,
      			dateEnd: settings.testValues.temperature.today.date + 1,
          })
          .then((rows) => {
            assert.equal(rows.length, 2);
            assert.deepEqual(rows[0], settings.testValues.temperature.today,
              'Today\'s entry should be returned');
          	assert.deepEqual(rows[1], settings.testValues.temperature.yesterday,
          	   'Yesterday\'s entry should be returned');
            done();
      		})
          .catch((error) => {
            done(error);
          });
      	});
      });

      describe('Humidity', function() {
      	it('Yesterday\'s and today\'s humidity should be returned',
        function(done) {
      		db.getHumidity({
            dateStart: settings.testValues.humidity.yesterday.date - 1,
      			dateEnd: settings.testValues.humidity.today.date + 1,
          })
          .then((rows) => {
            assert.equal(rows.length, 2);
            assert.deepEqual(rows[0], settings.testValues.humidity.today,
              'Today\'s entry should be returned');
          	assert.deepEqual(rows[1], settings.testValues.humidity.yesterday,
          	   'Yesterday\'s entry should be returned');
            done();
      		})
          .catch((error) => {
            done(error);
          });
      	});
      });

      describe('Last Temperature Entry', function() {
      	it('Should return the last temperature entry',
      	function(done) {
      		db.getLastTemperatureEntry()
          .then((row) => {
      			assert.deepEqual(row, settings.testValues.temperature.today);
      			done();
      		})
          .catch((error) => {
            done(error);
          });
      	});
      });

      describe('Last Humidity Entry', function() {
      	it('Should return the last temperature entry',
      	function(done) {
      		db.getLastHumidityEntry()
          .then((row) => {
      			assert.deepEqual(row, settings.testValues.humidity.today);
      			done();
      		})
          .catch((error) => {
            done(error);
          });
      	});
      });

    });

  });
})();
