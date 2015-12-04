#!/usr/bin/env node

'use strict';

var Frontend = require('../lib/frontend'),
    winston = require('winston'),
    config = require('../lib/cli');

var frontend = new Frontend();

frontend.run(config, function(error, data) {
  if (error) {
    winston.loggers.get('frontend').error(error);
    process.exit(1);
  }
});
