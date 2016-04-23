var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://rpi-weather.firebaseio.com/");
myFirebaseRef.set({
  devices: {
    uid: "someUID",
    name: "Some Name",
    temperature: {
      min: 4,
      max: 25,
      last: 20,
      date: 1235434,
      log: [
        {
          date: 1234543,
          temperature: 23
        }
      ]
    }
  }
});
