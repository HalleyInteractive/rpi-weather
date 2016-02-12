var Database = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var fs = require('fs');
var db = new Database();

before(function() {

	console.log("SETUP");

	settings.database_file = 'test_database.db';
	var dbexists = fs.existsSync(settings.database_file);

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
