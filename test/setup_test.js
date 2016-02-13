var Database = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var fs = require('fs');
var db = new Database();

before(function() {

	console.log("SETUP");

	settings.database_file = 'test_database.db';
	var dbexists = fs.existsSync(settings.database_file);

	settings.now = new Date();
	settings.seconds_today = (settings.now.getHours() * 60 * 60) + (settings.now.getMinutes() * 60) + settings.now.getSeconds();
	settings.seconds_in_day = 60*60*24;

	settings.test_values = {
		yesterday: {
			date: settings.now.getTime() - settings.seconds_today - (settings.seconds_in_day/2),
			temperature: 20
		},
		today: {
			date: settings.now.getTime() - settings.seconds_today,
			temperature: 21
		},
		max: {
			date: settings.now.getTime() - settings.seconds_today + 1,
			temperature: 28
		},
		min: {
			date: settings.now.getTime() - settings.seconds_today + 2,
			temperature: 1
		},
		tomorrow: {
			date: settings.now.getTime() - settings.seconds_today + (settings.seconds_in_day * 1.5),
			temperature: 22
		}
	};

	it("Yesterday, today and tomorrow should have different dates", function(done) {
		assert.notEqual(
			new Date(settings.test_values.today).getDate(),
			new Date(settings.test_values.yesterday).getDate()
		);
		assert.notEqual(
			new Date(settings.test_values.today).getDate(),
			new Date(settings.test_values.yesterdays).getDate()
		);
		done();
	});

	it("should not have a test database file", function(done) {
		assert.isFalse(dbexists, "Database does not exist");
		done();
	});

	it("should have created a database file", function(done) {
		db.init();
		var dbexists = fs.existsSync(settings.database_file);
		assert.isTrue(dbexists);
		done();
	});

	it("should not have any rows", function(done) {
		db.get(0, 99999999999, function(rows) {
			assert.equal(rows.length, 0);
			done();
		});
	});

});

after(function() {

	console.log("TEARDOWN");

	fs.unlinkSync(settings.database_file);
	var dbexists = fs.existsSync(settings.database_file);

	it("should have removed it's test database file", function(done) {
		assert.isFalse(dbexists);
		done();
	});

});
