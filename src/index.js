(function() {
  'use strict';

  const temperature = require('./temperature.js');
  const db = require('./database.js');
  const fs = require('fs');
  const server = require('./server.js');

  let lastTemperature = null;
  let settings = require('./settings.js');

  /**
  * Initialises the app
  */
  function init() {
    getDeviceUUID();
    db.init();
    server.init();
    setInterval(readTemperature.bind(this), 10000);
  }

  /**
  * Gets the device Unique Identifier from file
  * If the file doesn't exists, a new one will be created
  */
  function getDeviceUUID() {
    if (!fs.existsSync('./device.json')) {
      let uuid = require('node-uuid').v4();
      let device = {
        uuid: uuid
      };
      fs.writeFileSync("device.json", JSON.stringify(device));
    }

    var deviceIdJson = require('./device.json');
    settings.DEVICE_UUID = deviceIdJson.uuid;
    return deviceIdJson.uuid;
  }


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
      db.insert({
        device_id: settings.DEVICE_ID,
        date: new Date().getTime(),
        temperature: data
      },
  		function() {});
      server.update(data);
    }
  }

  init();

})();
