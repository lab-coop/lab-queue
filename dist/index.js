'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _message = require('./message');

var _connection = require('./connection');

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queueService(config) {
  var consume = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName, messageHandler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.get('queue.consume.defaults');
      var channel, consumerOptions;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getChannelAssert(queueName);

            case 2:
              channel = _context.sent;
              _context.next = 5;
              return channel.prefetch(options.prefetchCount);

            case 5:
              consumerOptions = (0, _lodash.pick)(options, ['noLocal', 'noAck', 'exclusive', 'priority', 'arguments']);

              consumerOptions.consumerTag = _shortid2.default.generate();
              channel.consume(queueName, (0, _message.handle)(messageHandler, ackFactory(channel), nackFactory(channel)), consumerOptions);
              return _context.abrupt('return', cancelConsumeFactory(channel, consumerOptions.consumerTag));

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function consume(_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var publish = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName, message) {
      var channel;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getChannelAssert(queueName);

            case 2:
              channel = _context2.sent;
              return _context2.abrupt('return', channel.sendToQueue(queueName, (0, _message.encode)(message)));

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function publish(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var exists = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(queueName) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return check(queueName);

            case 2:
              return _context3.abrupt('return', _context3.sent.hasOwnProperty('queue'));

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function exists(_x6) {
      return _ref3.apply(this, arguments);
    };
  }();

  var messageCount = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(queueName) {
      var queueData;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return check(queueName);

            case 2:
              queueData = _context4.sent;

              (0, _connection.punishNonExistentQueue)(queueName, queueData);
              return _context4.abrupt('return', queueData.messageCount);

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function messageCount(_x7) {
      return _ref4.apply(this, arguments);
    };
  }();

  var consumerCount = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(queueName) {
      var queueData;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return check(queueName);

            case 2:
              queueData = _context5.sent;

              (0, _connection.punishNonExistentQueue)(queueName, queueData);
              return _context5.abrupt('return', queueData.consumerCount);

            case 5:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function consumerCount(_x8) {
      return _ref5.apply(this, arguments);
    };
  }();

  var check = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(queueName) {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt('return', safeQueueOperation(queueName, checkQueueFactory(queueName)));

            case 1:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function check(_x9) {
      return _ref6.apply(this, arguments);
    };
  }();

  var remove = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(queueName) {
      var channel;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return getChannel(queueName);

            case 2:
              channel = _context7.sent;
              return _context7.abrupt('return', removeQueueFactory(queueName)(channel));

            case 4:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function remove(_x10) {
      return _ref7.apply(this, arguments);
    };
  }();

  var purge = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(queueName) {
      var channel;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt('return', safeQueueOperation(queueName, purgeQueueFactory(queueName)));

            case 3:
              channel = _context8.sent;
              return _context8.abrupt('return', purgeQueueFactory(queueName)(channel));

            case 5:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function purge(_x11) {
      return _ref8.apply(this, arguments);
    };
  }();

  var safeQueueOperation = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(queueName, queueOperation) {
      var channel, queueOperationResult;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return getChannel(queueName, true);

            case 2:
              channel = _context9.sent;
              _context9.next = 5;
              return (0, _connection.runQueueOperation)(function () {
                return queueOperation(channel);
              });

            case 5:
              queueOperationResult = _context9.sent;
              _context9.next = 8;
              return (0, _connection.closeChannel)(channel);

            case 8:
              return _context9.abrupt('return', queueOperationResult);

            case 9:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function safeQueueOperation(_x12, _x13) {
      return _ref9.apply(this, arguments);
    };
  }();

  var getChannelAssert = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(queueName) {
      var channel;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return getChannel(queueName);

            case 2:
              channel = _context10.sent;
              _context10.next = 5;
              return channel.assertQueue(queueName);

            case 5:
              return _context10.abrupt('return', channel);

            case 6:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function getChannelAssert(_x14) {
      return _ref10.apply(this, arguments);
    };
  }();

  var getChannel = function () {
    var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(queueName) {
      var forceNew = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var channel;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _connection.getOrCreateChannel)(queueName, createChannelFactory(), forceNew);

            case 2:
              channel = _context11.sent;

              (0, _connection.handleChannelError)(channel);
              return _context11.abrupt('return', channel);

            case 5:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    return function getChannel(_x16) {
      return _ref11.apply(this, arguments);
    };
  }();

  return Object.freeze({
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

  function checkQueueFactory(queueName) {
    return function (channel) {
      return channel.checkQueue(queueName);
    };
  }

  function removeIfExists(queueName) {
    return safeQueueOperation(queueName, removeQueueFactory(queueName));
  }

  function removeQueueFactory(queueName) {
    return function (channel) {
      return channel.deleteQueue(queueName);
    };
  }

  function purgeIfExists(queueName) {}

  function purgeQueueFactory(queueName) {
    return function (channel) {
      return channel.purgeQueue(queueName);
    };
  }

  function cancelConsumeFactory(channel, consumerTag) {
    return function () {
      return channel.cancel(consumerTag);
    };
  }

  function createChannelFactory() {
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
      var connection;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return (0, _connection.getConnection)(config.get('queue'));

            case 2:
              connection = _context12.sent;
              _context12.next = 5;
              return connection.createChannel();

            case 5:
              return _context12.abrupt('return', _context12.sent);

            case 6:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));
  }

  function ackFactory(channel) {
    return function (message) {
      return channel.ack(message);
    };
  }

  function nackFactory(channel) {
    return function (message) {
      return channel.nack(message);
    };
  }
}

// queueService.deps = ['config'];
exports.default = queueService;