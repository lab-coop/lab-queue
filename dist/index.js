'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var implementationName = config.get('queue.type') || 'amqp091';
  return require('./implementations/' + implementationName).default(config);
};