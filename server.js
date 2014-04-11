'use strict';

var hapi = require('hapi');
var auth = require('./auth');
var router = require('./router');

var server = hapi.createServer('0.0.0.0', 5000, {cors: true});

// Plugins
server.pack.require('hapi-auth-jwt', function (err) {
  if(err) {
    return console.log(err);
  }

  // Auth setup
  auth.setup(server);

  // Routes setup
  router.setup(server);

  // Start
  server.start(function () {
    console.log('Server started ', server.info.uri);
  });
});
