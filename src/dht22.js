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
      readout = sensor.read();
      return readout;
    }

    temperature() {
      return this.roundHalf(readout.temperature);
    }

    humidity() {
      return this.roundHalf(readout.humidity);
    }

    /**
    * roundHalf
    * Rounds a given floating number to it's closes .5 value
    * @param num {float} Floating number
    * @return {float} Floating number rounded to closest .5 value
    **/
    roundHalf(num) {
      return Math.round(num * 2) / 2;
    }

  }
  module.exports = new DHT22();
})();
