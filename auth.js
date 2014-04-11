'use strict';

var hapi = require('hapi');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var privateKey = '37LvDSm4XvjYOh9Y';
var ttl = 1*60*60*1000;   // 1 Hour


var merchant = {
  merchantId: 406528,
  scope: ['merchant']
};
var admin = {
  scope: ['admin']
};
var credentials = {
  admin: '12345',
  unicef: 'unicef'
};


module.exports = {
  /*
  *   Setup auth method
  */
  setup: function (server) {

    server.auth.strategy('token', 'jwt', {
      key: privateKey,
      validateFunc: function (token, callback) {
        // console.log('token', token);
        // Check token timestamp
        var diff = moment().diff(moment(token.iat*1000));
        if(diff > ttl) {
          return callback(null, false);
        }
        callback(null, true, token);
      }
    });
  },

  /*
  * Process login
  */
  login: function (request, reply) {

    if(!credentials[request.payload.user]) {
      return reply(hapi.error.unauthorized('Login Failed'));
    }
    if(credentials[request.payload.user] !== request.payload.pass) {
      return reply(hapi.error.unauthorized('Login Failed'));
    }

    var res;
    if(request.payload.user === 'admin') {
      res = {
        user: request.payload.user,
        scope: 'admin',
        token: jwt.sign(admin, privateKey)
      };
    }
    else {
      res = {
        user: request.payload.user,
        merchantId: merchant.merchantId,
        scope: 'merchant',
        token: jwt.sign(merchant, privateKey),
      };
    }
    reply(res);
  }
};
