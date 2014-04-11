'use strict';

var fs = require('fs');
var customers = JSON.parse(fs.readFileSync('./customers.json'));
var payments = JSON.parse(fs.readFileSync('./payments.json'));


module.exports = {
  /* Return a list of payemnts */
  payments: function (request, reply) {
    // console.log('payments', request.auth.credentials);
    reply(payments);
  },

  /* Return a list of customers */
  customers: function (request, reply) {
    // console.log('customers', request.auth.credentials);
    reply(customers);
  }
};
