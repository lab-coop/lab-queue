'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _azure = require('azure');

var _azure2 = _interopRequireDefault(_azure);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var createQueueOperation = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(operation) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', _bluebird2.default.promisify(serviceBus[operation], {
                context: serviceBus
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function createQueueOperation(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var getChannelAssert = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createQueueOperation('createQueueIfNotExists')(queueName);

            case 2:
              if (!queues.hasOwnProperty(queueName)) {
                queues[queueName] = {
                  consumers: {}
                };
              }

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function getChannelAssert(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var consume = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(queueName, handler) {
      var cancelled, lockedMessage, payload, consumerId;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              cancelled = false;

            case 1:
              if (!(cancelled === false)) {
                _context3.next = 12;
                break;
              }

              _context3.next = 4;
              return createQueueOperation('receiveQueueMessage')(queueName, { isPeekLock: true });

            case 4:
              lockedMessage = _context3.sent;
              payload = JSON.parse(lockedMessage.body);
              _context3.next = 8;
              return handler(payload);

            case 8:
              _context3.next = 10;
              return createQueueOperation('deleteMessage')(lockedMessage);

            case 10:
              _context3.next = 1;
              break;

            case 12:
              return _context3.abrupt('return', function () {
                cancelled = true;
              });

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function consume(_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  var exists = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(queueName) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', createQueueOperation('getQueue')(queueName));

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function exists(_x5) {
      return _ref4.apply(this, arguments);
    };
  }();

  var remove = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(queueName) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', createQueueOperation('deleteQueue')(queueName));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function remove(_x6) {
      return _ref5.apply(this, arguments);
    };
  }();

  var removeIfExists = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(queueName) {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt('return', remove(queueName));

            case 1:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function removeIfExists(_x7) {
      return _ref6.apply(this, arguments);
    };
  }();

  var purge = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(queueName) {
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              throw new Error('Not implemented');

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function purge(_x8) {
      return _ref7.apply(this, arguments);
    };
  }();

  var purgeIfExists = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              throw new Error('Not implemented');

            case 1:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function purgeIfExists() {
      return _ref8.apply(this, arguments);
    };
  }();

  var consumerCount = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(queueName) {
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function consumerCount(_x9) {
      return _ref9.apply(this, arguments);
    };
  }();

  var consumerCount = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(queueName) {
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function consumerCount(_x10) {
      return _ref10.apply(this, arguments);
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

  var serviceBusConnectionString = config.get('serviceBusConnectionString');
  var serviceBus = _azure2.default.createServiceBusService(serviceBusConnectionString);

  function addConsumer(queueName, consumer) {
    getChannelAssert(queueName);
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

  function publish(queueName, payload) {
    var message = {
      body: JSON.stringify(payload)
    };
    return createQueueOperation('sendQueueMessage')(queueName, message);
  }
};