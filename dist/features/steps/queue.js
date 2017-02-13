'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiSpies = require('chai-spies');

var _chaiSpies2 = _interopRequireDefault(_chaiSpies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiSpies2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

module.exports = function () {
  var container = this.container;
  var context = this.context;

  var callbacks = void 0;
  var callbackIndex = void 0;
  function resetCallbacks() {
    callbacks = [];
    callbackIndex = 0;
    for (var i = 0; i < 100; i++) {
      callbacks.push(_q2.default.defer());
    }
  }

  function asyncCallbackCounter(message) {
    callbacks[callbackIndex++].resolve(message);
  }

  function waitForXCallbacks(num) {
    return Promise.all(callbacks.slice(0, num).map(function (defer) {
      return defer.promise;
    }));
  }

  this.Given('"$queueName" doesn\'t exist', function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return container.queue;

            case 2:
              queue = _context.sent;
              _context.next = 5;
              return queue.removeIfExists(queueName);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  this.Given('"$queueName" is an empty, existing queue, without consumer', function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return container.queue;

            case 2:
              queue = _context2.sent;
              _context2.next = 5;
              return queue.removeIfExists(queueName);

            case 5:
              _context2.next = 7;
              return queue.getChannelAssert(queueName);

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  // this.Given('there is no consumer on "$queueName"', async function (queueName) {
  //   const queue = await container.queue;
  //   await queue.cancelAllConsuming(queueName);
  // });

  this.When('a random message pushed to queue "$queueName"', function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return container.queue;

            case 2:
              queue = _context3.sent;
              _context3.t0 = assert;
              _context3.next = 6;
              return queue.publish(queueName, true);

            case 6:
              _context3.t1 = _context3.sent;
              (0, _context3.t0)(_context3.t1, "Expected publish to return truthy");

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  this.When('the message "$message" is pushed to queue "$queueName"', function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(message, queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return container.queue;

            case 2:
              queue = _context4.sent;
              _context4.t0 = assert;
              _context4.next = 6;
              return queue.publish(queueName, message);

            case 6:
              _context4.t1 = _context4.sent;
              (0, _context4.t0)(_context4.t1, "Expected publish to return truthy");

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4, _x5) {
      return _ref4.apply(this, arguments);
    };
  }());

  this.When('a consumer is attached to queue "$queueName"', function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return container.queue;

            case 2:
              queue = _context5.sent;

              resetCallbacks();
              context.consumerCallback = _chai2.default.spy(asyncCallbackCounter);
              _context5.next = 7;
              return queue.consume(queueName, context.consumerCallback);

            case 7:
              context.cancelConsume = _context5.sent;

              expect(context.cancelConsume).to.be.a('function');

            case 9:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x6) {
      return _ref5.apply(this, arguments);
    };
  }());

  this.When('a consumer is attached to queue "$queueName" and immediately cancelled', function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return container.queue;

            case 2:
              queue = _context6.sent;

              resetCallbacks();
              context.consumerCallback = _chai2.default.spy(asyncCallbackCounter);
              _context6.next = 7;
              return queue.consume(queueName, context.consumerCallback);

            case 7:
              _context6.t0 = _context6.sent;
              (0, _context6.t0)();

            case 9:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x7) {
      return _ref6.apply(this, arguments);
    };
  }());

  this.When('"$queueName" contains $messageCount message, catch errors', function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(queueName, messageCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              messageCount = parseInt(messageCount);
              _context7.next = 3;
              return container.queue;

            case 3:
              queue = _context7.sent;

              this.thrown = false;
              _context7.prev = 5;
              _context7.next = 8;
              return queue.messageCount(queueName);

            case 8:
              checkResult = _context7.sent;

              expect(checkResult).to.equal(messageCount);
              // return assert(checkResult === messageCount, "Expected checkResult to equal messageCount");
              _context7.next = 16;
              break;

            case 12:
              _context7.prev = 12;
              _context7.t0 = _context7['catch'](5);

              console.log(_context7.t0);
              this.thrown = true;

            case 16:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this, [[5, 12]]);
    }));

    return function (_x8, _x9) {
      return _ref7.apply(this, arguments);
    };
  }());

  this.Then('"$queueName" has $consumerCount consumer, catch errors', function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(queueName, consumerCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              consumerCount = parseInt(consumerCount);
              _context8.next = 3;
              return container.queue;

            case 3:
              queue = _context8.sent;

              this.thrown = false;
              _context8.prev = 5;
              _context8.next = 8;
              return queue.consumerCount(queueName);

            case 8:
              checkResult = _context8.sent;
              return _context8.abrupt('return', assert(checkResult === consumerCount, "Expected checkResult to equal consumerCount"));

            case 12:
              _context8.prev = 12;
              _context8.t0 = _context8['catch'](5);

              console.log(_context8.t0);
              this.thrown = true;

            case 16:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this, [[5, 12]]);
    }));

    return function (_x10, _x11) {
      return _ref8.apply(this, arguments);
    };
  }());

  this.When('"$queueName" contains $messageCount message', function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(queueName, messageCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              messageCount = parseInt(messageCount);
              _context9.next = 3;
              return container.queue;

            case 3:
              queue = _context9.sent;
              _context9.next = 6;
              return queue.messageCount(queueName);

            case 6:
              checkResult = _context9.sent;

              expect(checkResult).to.equal(messageCount);

            case 8:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function (_x12, _x13) {
      return _ref9.apply(this, arguments);
    };
  }());

  this.Then('"$queueName" has $consumerCount consumer', function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(queueName, consumerCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              consumerCount = parseInt(consumerCount);
              _context10.next = 3;
              return container.queue;

            case 3:
              queue = _context10.sent;
              _context10.next = 6;
              return queue.consumerCount(queueName);

            case 6:
              checkResult = _context10.sent;
              return _context10.abrupt('return', assert(checkResult === consumerCount, "Expected checkResult to equal consumerCount"));

            case 8:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function (_x14, _x15) {
      return _ref10.apply(this, arguments);
    };
  }());

  this.Then('the last operation thrown error', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
    var queue;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return container.queue;

          case 2:
            queue = _context11.sent;

            assert(this.thrown === true, "Expected a thing to be thrown");

          case 4:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  })));

  this.Then('the consumer is called back with "$message"', function () {
    var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(message) {
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return waitForXCallbacks(1);

            case 2:
              expect(context.consumerCallback).to.be.called.with(message);

            case 3:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    return function (_x16) {
      return _ref12.apply(this, arguments);
    };
  }());

  this.Then('the consumer is called back "$times" times', function () {
    var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(times) {
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return waitForXCallbacks(parseInt(times));

            case 2:
              expect(context.consumerCallback).to.be.called.exactly(parseInt(times));

            case 3:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    return function (_x17) {
      return _ref13.apply(this, arguments);
    };
  }());
};