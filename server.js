var express = require('express');
var settings = require('./settings.js');
var app = express();
var port = process.env.PORT || settings.server_port;
var api = require('./api.js');

app.use('/api', api);
app.listen(port);
