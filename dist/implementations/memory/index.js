'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = memoryQueueService;

var _rr = require('rr');

var _rr2 = _interopRequireDefault(_rr);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function memoryQueueService(config, logger) {
  var consume = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName, consumer) {
      var consumerId, removeConsumer;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getChannelAssert(queueName);
              consumerId = addConsumer(queueName, consumer);
              removeConsumer = createRemoveConsumer(queueName, consumerId);

              process.nextTick(function () {
                return dispatchMessages(queueName, removeConsumer);
              });
              return _context.abrupt('return', removeConsumer);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function consume(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var dispatchMessages = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName, removeConsumer) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(consumerCount(queueName) && messageCount(queueName))) {
                _context2.next = 5;
                break;
              }

              _context2.next = 3;
              return dispatchOneMessage(queueName, chooseConsumer(queueName), removeConsumer);

            case 3:
              _context2.next = 0;
              break;

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function dispatchMessages(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var dispatchOneMessage = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(queueName, consumer, removeConsumer) {
      var message;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              message = getFirstMessage(queueName);
              _context3.prev = 1;
              _context3.next = 4;
              return consumer(message, createNack(queueName, message));

            case 4:
              _context3.next = 10;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3['catch'](1);

              logger.error('Consumer is removed because it has thrown error: ' + JSON.stringify(_context3.t0));
              removeConsumer();

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[1, 6]]);
    }));

    return function dispatchOneMessage(_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();

  var queues = {};
  var consumersChanged = false;

  return Object.freeze({
    getChannelAssert: getChannelAssert,
    consume: consume,
    publish: publish,
    exists: exists,
    remove: remove,
    removeIfExists: removeIfExists,
    purge: purge,
    purgeIfExists: purgeIfExists,
    messageCount: messageCount,
    consumerCount: consumerCount
  });

  function getChannelAssert(queueName) {
    if (!queues.hasOwnProperty(queueName)) {
      queues[queueName] = {
        messages: [],
        consumers: {},
        consumersArray: []
      };
    }
  }

  function exists(queueName) {
    return queues.hasOwnProperty(queueName);
  }

  function remove(queueName) {
    delete queues[queueName];
  }

  function removeIfExists(queueName) {
    if (exists(queueName)) {
      remove(queueName);
    }
  }

  function purge(queueName) {
    queues[queueName].messages = [];
  }

  function purgeIfExists(queueName) {
    if (exists(queueName)) {
      purge(queueName);
    }
  }

  function publish(queueName, message) {
    getChannelAssert(queueName);
    pushMessage(queueName, message);
    process.nextTick(function () {
      return dispatchMessages(queueName);
    });
    return true;
  }

  function addConsumer(queueName, consumer) {
    var consumerId = _shortid2.default.generate();
    queues[queueName].consumers[consumerId] = consumer;
    consumersChanged = true;
    return consumerId;
  }

  function createRemoveConsumer(queueName, consumerId) {
    return function () {
      delete queues[queueName].consumers[consumerId];
      consumersChanged = true;
    };
  }

  function chooseConsumer(queueName) {
    if (consumersChanged) {
      queues[queueName].consumersArray = Object.values(queues[queueName].consumers);
    }
    return (0, _rr2.default)(queues[queueName].consumersArray);
  }

  function createNack(queueName, message) {
    return function () {
      queues[queueName].messages.push(message);
    };
  }

  function getFirstMessage(queueName) {
    return queues[queueName].messages.shift();
  }

  function pushMessage(queueName, message) {
    queues[queueName].messages.push(message);
  }

  function messageCount(queueName) {
    return queues[queueName].messages.length;
  }

  function consumerCount(queueName) {
    return Object.values(queues[queueName].consumers).length;
  }
}