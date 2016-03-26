var db = require('./../src/database.js');
var settings = require('./../src/settings.js');
var assert = require('chai').assert;
var fs = require('fs');

before(function() {

	settings.DATABASE_FILE = 'test_database.db';
	var dbexists = fs.existsSync(settings.DATABASE_FILE);

	settings.now = new Date();
	settings.MILLISECONDS_TODAY = ((settings.now.getHours() * 60 * 60) +
	(settings.now.getMinutes() * 60) + settings.now.getSeconds()) * 1000;
  settings.DEVICE_UUID = 'test_devide_uuid';
  settings.DEVICE_ID = 1;

	settings.testValues = {
    temperature: {
  		yesterday: {
  			date: settings.now.getTime() -
  			settings.MILLISECONDS_IN_DAY +120000,
  			temperature: 20,
  		},
  		today: {
  			date: settings.now.getTime() - settings.MILLISECONDS_TODAY,
  			temperature: 21,
  		},
    }
	};

	it('Yesterday, today should have different dates',
	function(done) {
		assert.notEqual(
			new Date(settings.testValues.temperature.today.date).getDate(),
			new Date(settings.testValues.temperature.yesterday.date).getDate()
		);
		assert.equal(
			new Date(settings.testValues.temperature.yesterday.date).getDate(),
			new Date(new Date().getTime() - (60*60*24*1000) - 1).getDate()
		);
		assert.equal(
			new Date(settings.now.getTime() -
			settings.MILLISECONDS_TODAY).getSeconds(),
			0
		);
		assert.equal(
			new Date(settings.now.getTime() -
			settings.MILLISECONDS_TODAY).getMinutes(),
			0
		);
		assert.equal(
			new Date(settings.now.getTime() -
			settings.MILLISECONDS_TODAY).getHours(),
			0
		);
		done();
	});

	it('should not have a test database file', function(done) {
		assert.isFalse(dbexists, 'Database does not exist');
		done();
	});

	it('should have created a database file', function(done) {
		db.init();
		var dbexists = fs.existsSync(settings.DATABASE_FILE);
		assert.isTrue(dbexists);
		done();
	});

});

after(function() {

	fs.unlinkSync(settings.DATABASE_FILE);
	var dbexists = fs.existsSync(settings.DATABASE_FILE);

	it('should have removed it\'s test database file', function(done) {
		assert.isFalse(dbexists);
		done();
	});

});
