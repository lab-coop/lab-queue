'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var implementationName = config.get('queueService') || 'amqp';
  return require('./implementations/' + implementationName).default(config);
};