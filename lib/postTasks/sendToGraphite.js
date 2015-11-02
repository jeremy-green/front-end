'use strict';

var winston = require('winston'),
    GraphiteHandler = require('../graphite/graphiteHandler'),
    GraphiteCollector = require('../graphite/graphiteCollector');

exports.task = function(result, config, cb) {
  this.log = winston.loggers.get('frontend');

  var self = this;

  if (!config.graphitePort || !config.graphiteHost || config.noGraphite) {
    self.log.info('No Graphite specified. Use --verbose for more details.');
    self.log.verbose('\u2192', 'Graphite Port:', config.graphitePort);
    self.log.verbose('\u2192', 'Graphite Host:', config.graphiteHost);
    self.log.verbose('\u2192', 'No Graphite Config Option:', config.noGraphite);
    return cb(null);
  }

  var collector = new GraphiteCollector(config);
  var statistics = collector.collect(result, function (err, res) {
    var graphiteHandler = new GraphiteHandler(config);
    graphiteHandler.handleResults(res, cb);
  });

};
