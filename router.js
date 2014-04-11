'use strict';

var handler = require('./handler');
var auth = require('./auth');

function setup (server) {
  // Setup routes
  server.route([
    {
      method: 'GET',
      path: '/{something*}',
      handler: {
        directory: {
          path: './client/',
          index: true
        }
      }
    }, {
      method: 'GET',
      path: '/payments',
      config: {
        handler: handler.payments,
        auth: {
          strategy: 'token',
          scope: ['admin', 'merchant']
        }
      }
    }, {
      method: 'GET',
      path: '/customers',
      config: {
        handler: handler.customers,
        auth: {
          strategy: 'token',
          scope: 'admin'
        }
      }
    }, {
      method: 'POST',
      path: '/login',
      config: {
        handler: auth.login
      }
    }
  ]);
}

module.exports = { setup: setup };
