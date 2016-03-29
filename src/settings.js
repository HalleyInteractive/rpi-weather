(function() {
  'use strict';

  /**
  * Object with settings
  * @namespace
  * @property {number} MEASURE_INTERVAL - Time between reading the temperature
  * @property {string} DATABASE_FILE - Filename of the database
  * @property {number} SERVER_PORT - PORT OF THE SERVER
  * @property {number} MILLISECONDS_IN_DAY - Number of milliseconds in 1 day
  */
  let settings = {
    MEASURE_INTERVAL: 1000,
    DATABASE_FILE: 'weather.db',
    SERVER_PORT: 8080,
    MILLISECONDS_IN_DAY: 60 * 60 * 24 * 1000,
    DEVICE_UUID: '',
    DEVICE_ID: -1,
  };

  module.exports = settings;
})();
