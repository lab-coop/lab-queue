'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.handle = handle;
exports.encode = encode;
exports.decode = decode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handle(messageHandler, ack, nack) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(message) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(message !== null)) {
                _context.next = 13;
                break;
              }

              _context.prev = 1;
              _context.next = 4;
              return Promise.resolve(messageHandler(decode(message)));

            case 4:
              ack(message);
              _context.next = 11;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](1);

              nack(message);
              throw new Error(_context.t0);

            case 11:
              _context.next = 14;
              break;

            case 13:
              throw new Error('Message handler called with null.');

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 7]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

function encode(message) {
  return new Buffer(JSON.stringify(message));
}

function decode(message) {
  return JSON.parse(message.content.toString());
}