var db = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var fs = require('fs');

before(function() {

	console.log('SETUP');

	settings.DATABASE_FILE = 'test_database.db';
	var dbexists = fs.existsSync(settings.DATABASE_FILE);

	settings.now = new Date();
	settings.MILLISECONDS_TODAY = ((settings.now.getHours() * 60 * 60) +
	(settings.now.getMinutes() * 60) + settings.now.getSeconds()) * 1000;
	//settings.MILLISECONDS_IN_DAY = 60*60*24*1000;

	settings.testValues = {
		yesterday: {
			date: settings.now.getTime() -
			settings.MILLISECONDS_IN_DAY +120000,
			temperature: 20
		},
		today: {
			date: settings.now.getTime() - settings.MILLISECONDS_TODAY,
			temperature: 21
		},
		max: {
			date: settings.now.getTime() - settings.MILLISECONDS_TODAY - 1,
			temperature: 28
		},
		min: {
			date: settings.now.getTime() - settings.MILLISECONDS_TODAY - 2,
			temperature: 1
		},
		tomorrow: {
			date: settings.now.getTime() - settings.MILLISECONDS_TODAY +
			(settings.MILLISECONDS_IN_DAY * 1.5),
			temperature: 22
		}
	};

	it('Yesterday, today and tomorrow should have different dates',
	function(done) {
		assert.notEqual(
			new Date(settings.testValues.today.date).getDate(),
			new Date(settings.testValues.yesterday.date).getDate()
		);
		assert.notEqual(
			new Date(settings.testValues.today.date).getDate(),
			new Date(settings.testValues.tomorrow.date).getDate()
		);
		assert.equal(
			new Date(settings.testValues.yesterday.date).getDate(),
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
		var dbexists = fs.existsSync(settings.database_file);
		assert.isTrue(dbexists);
		done();
	});

	it('should not have any rows', function(done) {
		db.get(0, 99999999999, function(rows) {
			assert.equal(rows.length, 0);
			done();
		});
	});

});

after(function() {

	console.log('TEARDOWN');

	fs.unlinkSync(settings.database_file);
	var dbexists = fs.existsSync(settings.database_file);

	it('should have removed it\'s test database file', function(done) {
		assert.isFalse(dbexists);
		done();
	});

});
