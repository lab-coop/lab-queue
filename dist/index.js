'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var implementationName = config.get('queueService') || 'ampq';
  return require('./implementations/' + implementationName).default(config);
};