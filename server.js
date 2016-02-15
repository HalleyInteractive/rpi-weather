var settings = require('./settings.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var exphbs  = require('express-handlebars');
var port = process.env.PORT || settings.server_port;
var api = require('./api.js');
var Database = require('./database.js');
var db = new Database();

db.init();

app.use('/api', api);
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

app.use('/css', express.static('static/css'));

app.get('/', function (req, res) {
	db.getLastEntry(function(row) {
		row.scale = '˚';
		res.render('index', row);
	});
});

server.listen(port);

function update(temperature) {
	io.emit('update', {temperature: temperature});
}

module.exports.update = update;
