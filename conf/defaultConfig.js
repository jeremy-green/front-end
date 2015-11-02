module.exports = {
  graphitePort: 9100,
  graphiteHost: 'localhost',
  graphiteNamespace: 'frontend',
  includeProfiler: [
    'jshint',
    'complexity',
    'csslint',
    'stylestats',
    'scsslint'
  ]
};
