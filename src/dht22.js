(function() {
  'use strict';

  let sensor = require('node-dht-sensor');
  let readout = {
    temperature: 0,
    humidity: 0
  };

  const GPIO_PIN = 4;

  class DHT22 {

    constructor() {
      let initialised = sensor.initialize(22, GPIO_PIN);
      if(!initialised) {
        console.log('Failed to initialise sensor');
      }
    }

    read() {
      sensor.read();
    }

    temperature() {
      return readout.temperature;
    }

    humidity() {
      return readout.humidity;
    }
  }
  module.exports = new DHT22();
})();
