(function() {
  'use strict';

  const db = require('./database.js');
  const fs = require('fs');
  const server = require('./server.js');

  let lastTemperature = 0;
  let lastHumidity = 0;
  let settings = require('./settings.js');
  let dht22 = require('./dht22.js');

  /**
  * Initialises the app
  */
  function init() {
    getDeviceUUID();
    db.init();
    server.init();
    setInterval(readDHT22.bind(this), 5000);
  }

  function readDHT22() {
    dht22.read();
    checkTemperatureReading(dht22.temperature());
    checkHumidityReading(dht22.humidity());
  }

  /**
  * Gets the device Unique Identifier from file
  * If the file doesn't exists, a new one will be created
  */
  function getDeviceUUID() {
    if (!fs.existsSync('./device.json')) {
      let device = {
        uuid: require('node-uuid').v4(),
      };
      fs.writeFileSync('device.json', JSON.stringify(device));
    }

    let deviceIdJson = require('./device.json');
    settings.DEVICE_UUID = deviceIdJson.uuid;
    return deviceIdJson.uuid;
  }

  /**
  * Checks if temeperature is different from last reading.
  * Saves reading if needed
  * @param {object} temperatureReading Temperature reading including date and temperature
  */
  function checkTemperatureReading(temperatureReading) {
    if (temperatureReading !== lastTemperature) {
      lastTemperature = temperatureReading;
      db.insertTemperature({
        date: new Date().getTime(),
        temperature: temperatureReading,
      });
      server.update(dht22.readout());
    }
  }

  /**
  * Checks if humidity is different from last reading.
  * Saves reading if needed
  * @param {object} humidity Humidity reading including date and humidity
  */
  function checkHumidityReading(temperatureReading) {
    if (temperatureReading !== lastHumidity) {
      lastHumidity = temperatureReading;
      db.insertHumidity({
        date: new Date().getTime(),
        humidity: temperatureReading,
      });
      server.update(dht22.readout());
    }
  }

  init();

})();
