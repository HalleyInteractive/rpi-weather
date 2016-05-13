(function() {
  'use strict';
  let settings = require('./settings.js');
  let firebase = settings.FIREBASE.child('test/');
  setInterval(setItem.bind(this), 5000);

  function setItem() {
    let list = [];
    firebase.child('last/temperature').once('value', (snap) => {

      list = snap.val();
    });
    console.log(list);
    firebase.child('last/temperature').push().set({
      date: new Date().getTime()
    });
  }

})();
