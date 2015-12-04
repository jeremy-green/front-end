module.exports = {
  graphitePort: 9100,
  graphiteHost: 'localhost',
  graphiteNamespace: 'frontend',
  includeProfiler: [
    'eslint',
    'complexity',
    'csslint',
    'stylestats'
  ]
};
