"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queues = {};

var ensureQueue = function ensureQueue(queueName) {
  return queues[queueName] || (queues[queueName] = {
    messages: [],
    consumers: []
  });
};

var dispatchMessages = function dispatchMessages(queueName) {
  if (queues[queueName].consumers.length) {
    queues[queueName].messages.forEach(queues[queueName].consumers[0]);
    queues[queueName].messages = [];
  }
};

exports.default = function (config) {
  return {
    removeIfExists: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                delete queues[queueName];

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function removeIfExists(_x) {
        return _ref.apply(this, arguments);
      }

      return removeIfExists;
    }(),
    publish: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName, message) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ensureQueue(queueName);
                queues[queueName].messages.push(message);
                dispatchMessages(queueName);
                return _context2.abrupt("return", true);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      function publish(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return publish;
    }(),
    messageCount: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(queueName) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", queues[queueName].messages.length);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      function messageCount(_x4) {
        return _ref3.apply(this, arguments);
      }

      return messageCount;
    }(),
    consume: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(queueName, handler) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                ensureQueue(queueName);
                queues[queueName].consumers.push(handler);
                dispatchMessages(queueName);
                return _context4.abrupt("return", true);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      function consume(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return consume;
    }(),
    consumerCount: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(queueName) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", queues[queueName].consumers.length);

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      function consumerCount(_x7) {
        return _ref5.apply(this, arguments);
      }

      return consumerCount;
    }()
  };
};