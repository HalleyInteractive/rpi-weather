(function() {
  'use strict';

  const fs = require('fs');

  let lastTemperature = 0;
  let lastHumidity = 0;
  let settings = require('./settings.js');
  let dht22 = require('./dht22.js');
  let firebase = null;
  let temperatureLog = [];
  let humidityLog = [];

  /**
  * Initialises the app
  */
  function init() {
    getDeviceUUID()
    .then((deviceUUID) => {
      firebase.initializeApp({
        serviceAccount: "../firebase-secret.json",
        databaseURL: "https://weather-station.firebaseio.com"
      });
    });
  }

  /**
  * Reads the temperature from DHT22.
  */
  function readDHT22() {
    dht22.read();
    checkTemperatureReading(dht22.temperature());
    checkHumidityReading(dht22.humidity());
  }

  /**
  * Gets the device Unique Identifier from file.
  * If the file doesn't exists, a new one will be created.
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
            temperature: {
              last: {
                value: 0,
                date: 0
              },
              log: {
              }
            },
            humidity: {
              last: {
                value: 0,
                date: 0
              },
              log: {
              }
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

      let temperatureEntry = {
        value: temperatureReading,
        date: new Date().getTime(),
      };

      temperatureLog.push(temperatureEntry);
      if(temperatureLog.length > 100) {
        temperatureLog.shift();
      }

      firebase.child('temperature/last').update(temperatureEntry);
      firebase.child('temperature/log').set(temperatureLog);
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

      let humidityEntry = {
        value: humidityReading,
        date: new Date().getTime(),
      };

      humidityLog.push(humidityEntry);
      if(humidityLog.length > 100) {
        humidityLog.shift();
      }

      firebase.child('humidity/last').update(humidityEntry);
      firebase.child('humidity/log').set(humidityLog);
    }
  }

  init();

})();
