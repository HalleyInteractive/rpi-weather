const settings = require('./settings.js');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exphbs  = require('express-handlebars');
const api = require('./api.js');
const db = require('./database.js');
const port = process.env.PORT || settings.SERVER_PORT;

db.init();

app.use('/api', api);
app.engine('handlebars', exphbs({ defaultLayout: 'index' }));
app.set('view engine', 'handlebars');

// Static routes
app.use('/css', express.static('static/css'));

/**
* Main route that gets the current/last entry
* /
*/
app.get('/', (req, res) => {
  db.getLastEntry((row) => {
    row.scale = '˚';
    res.render('index', row);
  });
});

/**
* Shows a chart of the last 24 hours
* /chart
*/
app.get('/chart', (req, res) => {
  let now = new Date();
  db.get(now.getTime() - settings.MILLISECONDS_IN_DAY, now.getTime(),
  (r) => {
    res.render('chart', { 'rows': r });
  });
});

/**
* Start server
*/
server.listen(port);

/**
* Public function to update all connected clients with a new temperature
* @param {number} t Temperature to send out to all clients
*/
function update(t) {
  io.emit('update', { 'temperature': t });
}

// Make update publically available
module.exports.update = update;
