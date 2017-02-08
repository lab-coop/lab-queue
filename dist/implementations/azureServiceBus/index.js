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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {

  var serviceBusConnectionString = config.get('serviceBusConnectionString');
  var serviceBus = _azure2.default.createServiceBusService(serviceBusConnectionString);

  var sendMessageAsync = _bluebird2.default.promisify(serviceBus.sendQueueMessage, { context: serviceBus });
  var receiveOneAsync = _bluebird2.default.promisify(serviceBus.receiveQueueMessage, { context: serviceBus });
  var deleteMessageAsync = _bluebird2.default.promisify(serviceBus.deleteMessage, { context: serviceBus });

  var consume = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName, handler) {
      var lockedMessage, payload;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!true) {
                _context.next = 11;
                break;
              }

              _context.next = 3;
              return receiveOneAsync(queueName, { isPeekLock: true });

            case 3:
              lockedMessage = _context.sent;
              payload = JSON.parse(lockedMessage.body);
              _context.next = 7;
              return handler(payload);

            case 7:
              _context.next = 9;
              return deleteMessageAsync(lockedMessage);

            case 9:
              _context.next = 0;
              break;

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function consume(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var publish = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queueName, payload) {
      var message;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              message = { body: JSON.stringify(payload) };
              _context2.next = 3;
              return sendMessageAsync(queueName, message);

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function publish(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  return Object.freeze({
    consume: consume,
    publish: publish
  });
};