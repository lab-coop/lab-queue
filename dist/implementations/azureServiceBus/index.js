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

  var deleteMessageAsync = _bluebird2.default.promisify(serviceBus.deleteMessage, { context: serviceBus });
  var deleteMessageAsyncCurried = function deleteMessageAsyncCurried(lockedMessage) {
    return function () {
      return deleteMessageAsync(lockedMessage);
    };
  };

  var consume = function consume(queueName, handler) {
    serviceBus.receiveQueueMessage(queueName, { isPeekLock: true }, function (error, lockedMessage) {
      if (error) throw error;
      var deleteMessage = deleteMessageAsyncCurried(lockedMessage);
      var payload = JSON.parse(lockedMessage.body);
      handler(payload).then(deleteMessage).catch(function (err) {
        throw err;
      });
    });
  };

  var publish = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(queueName, payload) {
      var message;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              message = { body: JSON.stringify(payload) };
              _context.next = 3;
              return sendMessageAsync(queueName, message);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function publish(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return Object.freeze({
    consume: consume,
    publish: publish
  });
};