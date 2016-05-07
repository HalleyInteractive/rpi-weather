(function() {
  'use strict';

  const fs = require('fs');

  let lastTemperature = 0;
  let lastHumidity = 0;
  let settings = require('./settings.js');
  let dht22 = require('./dht22.js');
  let firebase = null;

  /**
  * Initialises the app
  */
  function init() {
    getDeviceUUID()
    .then((deviceUUID) => {
      firebase = settings.FIREBASE.child('devices/' + deviceUUID);
      setInterval(readDHT22.bind(this), 5000);
    });
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
    let promise = new Promise(function(resolve) {
      if (!fs.existsSync('./device.json')) {
        let device = {
          uuid: require('node-uuid').v4(),
        };
        fs.writeFileSync('device.json', JSON.stringify(device));
      }

      let deviceIdJson = require('./device.json');
      settings.DEVICE_UUID = deviceIdJson.uuid;

      settings.FIREBASE.child('devices/' + settings.DEVICE_UUID)
      .once("value", (snapshot) => {
        if(!snapshot.exists()) {
          settings.FIREBASE
          .child('devices/' + settings.DEVICE_UUID)
          .set({
            info: {
              name: 'unnamed',
              uuid: deviceIdJson.uuid
            },
            last: {
              temperature: {
                value: 0,
                date: 0
              },
              humidity: {
                value: 0,
                date: 0
              }
            },
            log: {
              temperature: [],
              humidity: []
            }
          });
        }
        resolve(deviceIdJson.uuid);
      });
    });

    return promise;
  }

  /**
  * Checks if temeperature is different from last reading.
  * Saves reading if needed
  * @param {object} temperatureReading Temperature reading including date and temperature
  */
  function checkTemperatureReading(temperatureReading) {
    if (temperatureReading !== lastTemperature) {
      lastTemperature = temperatureReading;

      firebase.child('last/temperature').update({
        value: temperatureReading,
        date: new Date().getTime(),
      });

      firebase.child('log/temperature').push().set({
        date: new Date().getTime(),
        value: temperatureReading
      });
    }
  }

  /**
  * Checks if humidity is different from last reading.
  * Saves reading if needed
  * @param {object} humidity Humidity reading including date and humidity
  */
  function checkHumidityReading(humidityReading) {
    if (humidityReading !== lastHumidity) {
      lastHumidity = humidityReading;

      firebase.child('last/humidity').update({
        value: humidityReading,
        date: new Date().getTime(),
      });
      firebase.child('log/humidity').push().set({
        date: new Date().getTime(),
        value: humidityReading
      });
    }
  }

  init();

})();
