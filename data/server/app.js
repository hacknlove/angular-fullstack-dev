/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(8080, function () {
  console.log('Express server listening on %d, in %s mode', app.get('env'));
});

var mongoHost = process.env.MONGO_PORT_27017_TCP_ADDR,
mongoPort = process.env.MONGO_PORT_27017_TCP_PORT;


// Expose app
exports = module.exports = app;
