var settings = require('./settings.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exphbs  = require('express-handlebars');
var api = require('./api.js');
var db = require('./database.js');
var port = process.env.PORT || settings.SERVER_PORT;

db.init();

app.use('/api', api);
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

// Static routes
app.use('/css', express.static('static/css'));

/**
* Main route that gets the current/last entry
* /
*/
app.get('/', function (req, res) {
	db.getLastEntry(function(row) {
		row.scale = '˚';
		res.render('index', row);
	});
});

/**
* Shows a chart of the last 24 hours
* /chart
*/
app.get('/chart', function (req, res) {
	var now = new Date();
	db.get(now.getTime() - settings.MILLISECONDS_IN_DAY, now.getTime(),
	function(rows) {
		res.render('chart', {rows: rows});
	});
});

/**
* Start server
*/
server.listen(port);

/**
* Public function to update all connected clients with a new temperature
*/
function update(temperature) {
	io.emit('update', {temperature: temperature});
}

// Make update publically available
module.exports.update = update;
