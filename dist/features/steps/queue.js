'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var container = this.container;
  var lastMessage = void 0;

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

  this.When('a random message pushed to queue "$queueName"', function () {
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
              _context2.t0 = _chai.assert;
              _context2.next = 6;
              return queue.publish(queueName, true);

            case 6:
              _context2.t1 = _context2.sent;
              (0, _context2.t0)(_context2.t1, "Expected publish to return truthy");

            case 8:
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

  this.When('the message "$message" is pushed to queue "$queueName"', function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(message, queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return container.queue;

            case 2:
              queue = _context3.sent;
              _context3.t0 = _chai.assert;
              _context3.next = 6;
              return queue.publish(queueName, message);

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

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }());

  this.When('a consumer is attached to queue "$queueName"', function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(queueName) {
      var queue;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return container.queue;

            case 2:
              queue = _context4.sent;
              _context4.t0 = _chai.assert;
              _context4.next = 6;
              return queue.consume(queueName, function (message) {
                lastMessage = message;
              });

            case 6:
              _context4.t1 = _context4.sent;
              (0, _context4.t0)(_context4.t1, "Expected consume to return truthy");

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());

  this.When('"$queueName" contains $messageCount message', function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(queueName, messageCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              messageCount = parseInt(messageCount);
              _context5.next = 3;
              return container.queue;

            case 3:
              queue = _context5.sent;

              this.thrown = false;
              _context5.prev = 5;
              _context5.next = 8;
              return queue.messageCount(queueName);

            case 8:
              checkResult = _context5.sent;
              return _context5.abrupt('return', (0, _chai.assert)(checkResult === messageCount, "Expected checkResult to equal messageCount"));

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5['catch'](5);

              console.log(_context5.t0);
              this.thrown = true;

            case 16:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[5, 12]]);
    }));

    return function (_x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }());

  this.Then('"$queueName" has $consumerCount consumer', function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(queueName, consumerCount) {
      var queue, checkResult;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              consumerCount = parseInt(consumerCount);
              _context6.next = 3;
              return container.queue;

            case 3:
              queue = _context6.sent;

              this.thrown = false;
              _context6.prev = 5;
              _context6.next = 8;
              return queue.consumerCount(queueName);

            case 8:
              checkResult = _context6.sent;
              return _context6.abrupt('return', (0, _chai.assert)(checkResult === consumerCount, "Expected checkResult to equal consumerCount"));

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6['catch'](5);

              console.log(_context6.t0);
              this.thrown = true;

            case 16:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[5, 12]]);
    }));

    return function (_x8, _x9) {
      return _ref6.apply(this, arguments);
    };
  }());

  this.Then('the last operation thrown error', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
    var queue;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return container.queue;

          case 2:
            queue = _context7.sent;

            (0, _chai.assert)(this.thrown === true, "Expected a thing to be thrown");

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));

  this.Then('the last operation didn\'t throw error', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
    var queue;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return container.queue;

          case 2:
            queue = _context8.sent;

            (0, _chai.assert)(this.thrown === false, "Expected nothing to be thrown");

          case 4:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  })));

  this.Then('the consumer is called back with "$message"', function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(message) {
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              (0, _chai.assert)(lastMessage === message, "Got the wrong message");

            case 1:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function (_x10) {
      return _ref9.apply(this, arguments);
    };
  }());
};