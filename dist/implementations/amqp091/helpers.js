"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAllCancelConsuming = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var runAllCancelConsuming = exports.runAllCancelConsuming = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            assertCancelConsumingCallbacks(queueName);
            _context.next = 3;
            return Promise.all(cancelConsumingCallbacks[queueName].map(function (cancelConsuming) {
              return cancelConsuming();
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function runAllCancelConsuming(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.addCancelConsuming = addCancelConsuming;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cancelConsumingCallbacks = {};

function assertCancelConsumingCallbacks(queueName) {
  if (!cancelConsumingCallbacks.hasOwnProperty(queueName)) {
    cancelConsumingCallbacks[queueName] = [];
  }
}

function addCancelConsuming(queueName, cancelConsuming) {
  assertCancelConsumingCallbacks(queueName);
  cancelConsumingCallbacks[queueName].push(cancelConsuming);
}