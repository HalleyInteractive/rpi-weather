(function() {
  'use strict';
  const fs = require('fs');
  const sqlite3 = require('sqlite3').verbose();
  const settings = require('./settings.js');

  /**
  * @class Database
  * Does all communication with the database
  */
  class Database {

    /**
    * @constructor
    * Initialises properties
    */
    constructor() {
      this.insertStatement = null;
      this.selectSTatement = null;
      this.db = null;
    }

    /**
    * @method init
    * Creates database file if needed and prepares statements
    * database connection is stored in global.db
    */
    init() {
      if (!global.db) {
        if (!fs.existsSync(settings.DATABASE_FILE)) {
          let err = fs.writeFileSync(settings.DATABASE_FILE, '', {
            flags: 'wx',
          });
          if (err) {
            console.log(err);
          }
        }
        global.db = new sqlite3.Database(settings.DATABASE_FILE);
      }
      this.db = global.db;
      this.createTable();
      this.insertStatement = this.db.prepare('INSERT INTO temperature ' +
        '(device_id, date, temperature) VALUES($device_id, $date, $temperature)');
      this.selectStatement = this.db.prepare('SELECT date, temperature FROM ' +
        'temperature WHERE date >= $dateStart AND date <= $dateEnd');

      this.addDevice();
    }

    addDevice() {
      let uuidStatement =
        this.db.prepare('INSERT INTO device (uuid) VALUES ($uuid)');
      uuidStatement.run({$uuid: settings.DEVICE_UUID});
      this.db.get('SELECT id FROM device WHERE uuid = \'' +
        settings.DEVICE_UUID + '\'', (err, row) => {
        if (err) {
          console.log(err);
        }
        settings.DEVICE_ID = row.id;
      });
    }

    /**
    * @method createTable
    * Creates the temperature TABLE
    * @private
    */
    createTable() {
      this.db.serialize(() => {

        this.db.run('CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY ' +
        'KEY AUTOINCREMENT UNIQUE NOT NULL, name VARCHAR (56) DEFAULT ' +
        '\'No name\', uuid VARCHAR (36) UNIQUE ON CONFLICT IGNORE NOT NULL);');

        this.db.run('CREATE TABLE IF NOT EXISTS temperature ' +
        '(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, device_id ' +
        'INTEGER REFERENCES device (id) ON DELETE CASCADE ON UPDATE ' +
        'CASCADE, date DATETIME, temperature NUMERIC);');

        this.db.run('CREATE TABLE IF NOT EXISTS humidity ' +
        '(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, device_id ' +
        'INTEGER REFERENCES device (id) ON DELETE CASCADE ON UPDATE ' +
        'CASCADE, date DATETIME, humidity NUMERIC);');

      });
    }

    /**
    * @method insert
    * Adds a temperature reading to the Database
    * @param data {object} Date and temperature object
    * @property {number} data.date - Date of the temperature reading
    * @property {number} data.temperature - Temperature value
    * @param callback {Function} Is called after the row has been inserted
    */
    insert(data, callback) {
      this.insertStatement.run({
        $device_id: data.device_id,
        $date: data.date,
        $temperature: data.temperature,
      }, function(err) {
        if (err) {
          console.log(err);
        }
        callback(err);
      });
    }

    /**
    * @method get
    * Returns rows from the database
    * @param dateStart {number} Start date of the date range to select
    * @param dateEnd {number} End date of the date range to select
    * @param callback {Function} Is called with the rows from the select query
    */
    get(dateStart, dateEnd, callback) {
      this.selectStatement.all({
        $dateStart: dateStart,
        $dateEnd: dateEnd,
      }, function(err, results) {
        if (err) {
          console.log(err);
        }
        callback(results);
      });
    }

    /**
    * @method extremes
    * Returns a min and max temperature from the database
    * Returned object will have min and max properties
    * @param dateStart {number} Start date of the date range to select
    * @param dateEnd {number} End date of the date range to select
    * @param callback {Function} Is called with the rows from the select query
    */
    extremes(dateStart, dateEnd, callback) {
      let extremes = {
        min: {},
        max: {},
      };

      let filterQuery = dateStart || dateEnd ? ' WHERE' : '';
      if (dateStart) {
        filterQuery += ' date >= ' + dateStart.toString();
      }
      if (dateEnd) {
        if (dateStart) {
          filterQuery += ' AND';
        }
        filterQuery += ' date < ' + dateEnd.toString();
      }

      this.db.get('SELECT date, MIN(temperature) as temperature FROM temperature' + filterQuery, (err, row) => {
        if (err) {
          console.log(err);
        }
        extremes.min = row;
        this.db.get('SELECT date, MAX(temperature) as temperature FROM temperature' + filterQuery, (err, row) => {
          if (err) {
            console.log(err);
          }
          extremes.max = row;
          callback(extremes);
        });
      });
    }

    /**
    * @method getLastEntry
    * Returns THE last entry in the database
    * @param callback {Function} Is called with the row from the select query
    */
    getLastEntry(callback) {
      this.db.get('SELECT date, temperature FROM temperature ORDER BY date DESC LIMIT 1', function(err, row) {
        if (err) {
          console.log(err);
        }
        callback(row);
      });
    }
  }

  module.exports = new Database();
}());
