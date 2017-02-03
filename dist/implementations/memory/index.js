"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var queues = {};

var ensureQueue = function ensureQueue(queueName) {
  return queues[queueName] || (queues[queueName] = {
    thingsPassedToPublish: [],
    thingsPassedToConsume: []
  });
};

exports.default = function (config) {
  return {
    removeIfExists: function removeIfExists(queueName) {
      delete queues[queueName];
    },
    publish: function publish(queueName, noIdeaWhatThisArgumentIs) {
      ensureQueue(queueName);
      queues[queueName].thingsPassedToPublish.push(noIdeaWhatThisArgumentIs);
      return true;
    },
    messageCount: function messageCount(queueName) {
      return queues[queueName].thingsPassedToPublish.length;
    },
    consume: function consume(queueName, noIdeaWhatThisArgumentIs) {
      ensureQueue(queueName);
      queues[queueName].thingsPassedToConsume.push(noIdeaWhatThisArgumentIs);
      return true;
    },
    consumerCount: function consumerCount(queueName) {
      return queues[queueName].thingsPassedToConsume.length;
    }
  };
};