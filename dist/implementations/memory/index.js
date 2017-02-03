"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var queues = {};

var ensureQueue = function ensureQueue(queueName) {
  return queues[queueName] || (queues[queueName] = {
    messages: [],
    consumers: []
  });
};

var dispatchMessages = function dispatchMessages(queueName) {
  return queues[queueName].consumers.length && queues[queueName].messages.forEach(queues[queueName].consumers[0]);
};

exports.default = function (config) {
  return {
    removeIfExists: function removeIfExists(queueName) {
      delete queues[queueName];
    },
    publish: function publish(queueName, message) {
      ensureQueue(queueName);
      queues[queueName].messages.push(message);
      dispatchMessages(queueName);
      return true;
    },
    messageCount: function messageCount(queueName) {
      return queues[queueName].messages.length;
    },
    consume: function consume(queueName, handler) {
      ensureQueue(queueName);
      queues[queueName].consumers.push(handler);
      dispatchMessages(queueName);
      return true;
    },
    consumerCount: function consumerCount(queueName) {
      return queues[queueName].consumers.length;
    }
  };
};