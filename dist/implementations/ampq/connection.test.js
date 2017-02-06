'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _connection = require('./connection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectionConfigs = [{
  name: 1
}, {
  name: 2
}];

afterEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _connection.closeConnections)();

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})));

it('should add heartbeat parameter', function () {
  expect((0, _connection.assertHeartBeatSupport)('amqp://localhost')).toBe('amqp://localhost');
  expect((0, _connection.assertHeartBeatSupport)('amqp://localhost', false)).toBe('amqp://localhost');
  expect((0, _connection.assertHeartBeatSupport)('amqp://localhost', true)).toBe('amqp://localhost');
  expect((0, _connection.assertHeartBeatSupport)('amqp://localhost', 10)).toBe('amqp://localhost?heartbeat=10');
});

it('should create a connection', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 2:
          expect(Object.keys((0, _connection.getConnections)())).toHaveLength(1);

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})));

it('should close a single connection', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
  var connection;
  return _regenerator2.default.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 2:
          connection = _context3.sent;
          _context3.next = 5;
          return (0, _connection.closeConnection)(connection);

        case 5:
          expect(Object.keys((0, _connection.getConnections)())).toHaveLength(0);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
})));

it('shouldn\'t complain to close an already closed connection', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
  var connection;
  return _regenerator2.default.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 2:
          connection = _context4.sent;
          _context4.next = 5;
          return (0, _connection.closeConnection)(connection);

        case 5:
          _context4.next = 7;
          return (0, _connection.closeConnection)(connection);

        case 7:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
})));

it('should reuse an already established connection', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
  return _regenerator2.default.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 2:
          _context5.next = 4;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 4:
          expect(Object.keys((0, _connection.getConnections)())).toHaveLength(1);

        case 5:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
})));

it('should create a new connection if the connection string differs', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
  return _regenerator2.default.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 2:
          _context6.next = 4;
          return (0, _connection.getConnection)(connectionConfigs[0]);

        case 4:
          _context6.next = 6;
          return (0, _connection.getConnection)(connectionConfigs[1]);

        case 6:
          expect(Object.keys((0, _connection.getConnections)())).toHaveLength(2);

        case 7:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, this);
})));

it('create channel should call channel creator exactly once', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
  var channelCreator;
  return _regenerator2.default.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          channelCreator = jest.fn();
          _context7.next = 3;
          return (0, _connection.getOrCreateChannel)('test-channel', channelCreator);

        case 3:
          expect(channelCreator.mock.calls.length).toBe(1);

        case 4:
        case 'end':
          return _context7.stop();
      }
    }
  }, _callee7, this);
})));