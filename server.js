var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var api = require('./api.js');

app.use('/api', api);
app.listen(port);
