(function() {
  'use strict';

  const temperature = require('./temperature.js');
  const db = require('./database.js');
  const server = require('./server.js');

  let lastTemperature = null;

  db.init();

  setInterval(readTemperature.bind(this), 10000);

  /**
  * Reads the temperature value from the module
  */
  function readTemperature() {
    temperature.readTemperature(checkTemperatureReading.bind(this));
  }

  /**
  * Checks if temeperature is different from last reading.
  * Saves reading if needed
  * @param {object} data Temperature reading including date and temperature
  */
  function checkTemperatureReading(data) {
    if (data !== lastTemperature) {
      lastTemperature = data;
      db.insert({ date: new Date().getTime(), temperature: data },
  		function() {});
      server.update(data);
    }
  }
})();
