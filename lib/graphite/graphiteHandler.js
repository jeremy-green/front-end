'use strict';

var url = require('url'),
    async = require('async'),
    winston = require('winston'),
    graphite = require('graphite');

function GraphiteHandler (config) {
  this.config = config;
  this.namespace = this.config.graphiteNamespace;
  this.host = this.config.graphiteHost;
  this.port = this.config.graphitePort;

  this.log = winston.loggers.get('frontend');

  this.clientUrl = url.format({
    protocol: 'plaintext',
    slashes: true,
    host: this.host,
    port: this.port,
    pathname: '/'
  });
}

GraphiteHandler.prototype.send = function send (data, cb) {
  var self = this,
      client = graphite.createClient(this.clientUrl);

  this.log.verbose(data);

  client.write(data, function writeCallback (graphiteError) {
    if (graphiteError) { self.log.error(graphiteError); }

    client.end();
    cb(graphiteError);
  });

};

GraphiteHandler.prototype.handleResults = function handleResults (results, callback) {
  var self = this;

  async.forEachOf(
    results,
    function iterator (value, key, cb) {
      var prefix = self.namespace,
          data = {};

      data[prefix] = {};
      data[prefix][key] = value;

      self.log.info('Sending ' + key + ' data to Graphite');
      self.send(data, cb);
    },
    function done (err) {
      self.log.info('Data sent to Graphite.');
      callback(err, results);
    }
  );

};

module.exports = GraphiteHandler;
