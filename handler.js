'use strict';

const app = require('./server4000');
const serverless = require('serverless-http');

module.exports.chargex = serverless(app);
