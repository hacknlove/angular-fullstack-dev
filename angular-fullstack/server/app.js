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
var database = require('./components/database');
var response = require('./components/response').response;
var mongoHost = process.env.MONGO_PORT_27017_TCP_ADDR || process.env.MONGO_ADDR || 'localhost',
mongoPort = process.env.MONGO_PORT_27017_TCP_PORT||process.env.MONGO_PORT || 27017;

app.use(response);

database.connect({tufiesta:{url:'mongodb://'+mongoHost+':'+mongoPort+'/data'}})
.then(function(){
  require('./config/express')(app);
  require('./routes')(app);

  // Start server
  server.listen(8080, function () {
    console.log('Express server in %s mode', app.get('env'));
  });
})
.catch(function(err){
  console.log('----------------------------')
  console.log(err.stack);
  console.log(err)
  console.log('----------------------------')
});

process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});

exports = module.exports = app;
