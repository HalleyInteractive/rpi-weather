(function() {
  'use strict';
  let fs = require('fs');
  let sqlite3 = require('sqlite3').verbose();
  let settings = require('./settings.js');

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

      this.insertTemperatureQuery = this.db.prepare(
        'INSERT INTO temperature (device_id, date, temperature) ' +
        ' VALUES($device, $date, $value)');
      this.insertHumidityQuery = this.db.prepare(
        'INSERT INTO humidity (device_id, date, humidity) ' +
        ' VALUES($device, $date, $value)');

      this.selectTemperatureQuery = this.db.prepare(
        'SELECT date, temperature FROM temperature WHERE date >= $dateStart ' +
        'AND date <= $dateEnd AND device_id = $device ORDER BY date DESC');
      this.selectHumidityQuery = this.db.prepare(
        'SELECT date, humidity FROM humidity WHERE date >= $dateStart ' +
        'AND date <= $dateEnd AND device_id = $device ORDER BY date DESC');

      this.lastTemperatureEntryQuery = this.db.prepare(
        'SELECT date, temperature FROM temperature WHERE device_id = $device ' +
        'ORDER BY date DESC LIMIT 1');
      this.lastHumidityEntryQuery = this.db.prepare(
        'SELECT date, humidity FROM humidity WHERE device_id = $device ' +
        'ORDER BY date DESC LIMIT 1');

      this.addDevice(settings.DEVICE_UUID);
    }

    // TODO: Add insertTemperature and insertHumidity functions
    // Let device_id be settings.DEVICE_ID if not provided

    /**
    * @method addDevice
    * Adds the device UUID to the database if not already existing
    * Stores the database id for this uuid into settings.DEVICE_ID
    * @param uuid {string} UUID String for this device
    * @private
    */
    addDevice(uuid) {
      let uuidQuery =
        this.db.prepare('INSERT INTO device (uuid) VALUES ($uuid)');
      uuidQuery.run({ $uuid: uuid });
      this.db.get('SELECT id FROM device WHERE uuid = \'' +
      uuid + '\'', (err, row) => {
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

    insertHumidity(data, deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let queryData = Object.assign({}, data, {
        device: deviceId,
        metric: 'humidity',
        value: data.humidity,
      });

      return this.insert(queryData);
    }

    insertTemperature(data, deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let queryData = Object.assign({}, data, {
        device: deviceId,
        metric: 'temperature',
        value: data.temperature,
      });

      return this.insert(queryData);
    }

    /**
    * @method insert
    * Adds a temperature reading to the Database
    * @param data {object} Date and temperature object
    * @property {string} data.device - Device id
    * @property {string} data.metric - Metric, temperature or humidity
    * @property {number} data.date - Date of the temperature reading
    * @property {number} data.temperature - Temperature value
    * @return {Promise}
    */
    insert(data) {

      let query = null;

      switch (data.metric) {
        case 'temperature':
          query = this.insertTemperatureQuery;
          break;
        case 'humidity':
          query = this.insertHumidityQuery;
          break;
      }

      let promise = new Promise((resolve, reject) => {
        if(query !== null) {
          query.run({
            $device: data.device,
            $date: data.date,
            $value: data.value,
          }, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });

      return promise;
    }

    getTemperature(data, deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let queryData = Object.assign({}, data, {
        device: deviceId,
        metric: 'temperature',
      });

      return this.get(queryData);
    }

    getHumidity(data, deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let queryData = Object.assign({}, data, {
        device: deviceId,
        metric: 'humidity',
      });

      return this.get(queryData);
    }

    /**
    * @method get
    * Returns rows from the database
    * @param data {object} Date and temperature object
    * @property {string} data.device - Device id
    * @property {string} data.metric - Metric, temperature or humidity
    * @property {number} data.dateStart - Start date, date range
    * @property {number} data.dateEnd - End date, date range
    * @return {Promise} Promise object with result
    */
    get(data) {

      let query = null;

      switch (data.metric) {
        case 'temperature':
          query = this.selectTemperatureQuery;
          break;
        case 'humidity':
          query = this.selectHumidityQuery;
          break;
      }

      let promise = new Promise((resolve, reject) => {

        if(query !== null) {
          query.all({
            $device: data.device,
            $dateStart: data.dateStart,
            $dateEnd: data.dateEnd,
          }, function(err, results) {
            if (err) {
              reject(err);
            }
            resolve(results);
          });
        }
      });

      return promise;
    }

    getLastTemperatureEntry(deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let data = {
        device: deviceId,
        metric: 'temperature',
      };

      return this.getLastEntry(data);
    }

    getLastHumidityEntry(deviceId) {
      deviceId = deviceId === undefined ? settings.DEVICE_ID : deviceId;
      let data = {
        device: deviceId,
        metric: 'humidity',
      };

      return this.getLastEntry(data);
    }

    /**
    * @method getLastEntry
    * Returns THE last entry in the database
    * @param data {object} Date and temperature object
    * @property {string} data.device - Device id
    * @property {string} data.metric - Metric, temperature or humidity
    * @return {Promise} Row from the select query
    */
    getLastEntry(data) {

      let query = null;

      switch (data.metric) {
        case 'temperature':
          query = this.lastTemperatureEntryQuery;
          break;
        case 'humidity':
          query = this.lastHumidityEntryQuery;
          break;
      }

      let promise = new Promise((resolve, reject) => {
        if(query !== null) {
          query.all({ $device: data.device }, function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result[0]);
            }
          });
        }
      });

      return promise;
    }
  }

  module.exports = new Database();
}());
