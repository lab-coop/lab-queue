'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runQueueOperation = exports.getChannel = exports.closeConnection = exports.closeConnections = exports.getConnection = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getConnection = exports.getConnection = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(config) {
    var connectionKey, connectionUrl, connect, storeConnection, connectAndStore, connection;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = (0, _lodash.defaults)(config, _defaults2.default);
            connectionKey = getConnectionKey(config);

            if (connections.hasOwnProperty(connectionKey)) {
              _context.next = 11;
              break;
            }

            connectionUrl = assertHearthBeatSupport(config.url, config.hearthbeat);
            connect = connectFactory(connectionUrl);
            storeConnection = storeConnectionFactory(connectionKey);
            connectAndStore = connectAndStoreFactory(connect, storeConnection);
            _context.next = 9;
            return connectAndStore(connect, storeConnection);

          case 9:
            connection = _context.sent;

            handleConnectionError(connection, config.reconnect, connectAndStore);

          case 11:
            return _context.abrupt('return', connections[connectionKey]);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getConnection(_x) {
    return _ref.apply(this, arguments);
  };
}();

var closeConnections = exports.closeConnections = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Promise.all((0, _lodash.values)(connections).map(closeConnection));

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function closeConnections() {
    return _ref5.apply(this, arguments);
  };
}();

var closeConnection = exports.closeConnection = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(connection) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return connection.close();

          case 3:
            return _context6.abrupt('return', _context6.sent);

          case 6:
            _context6.prev = 6;
            _context6.t0 = _context6['catch'](0);
            return _context6.abrupt('return', true);

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 6]]);
  }));

  return function closeConnection(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

var getChannel = exports.getChannel = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(queueName, createChannel) {
    var forceNewChannel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var channel;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!forceNewChannel) {
              _context7.next = 8;
              break;
            }

            _context7.next = 3;
            return createChannel();

          case 3:
            channel = _context7.sent;

            handleError(channel);
            return _context7.abrupt('return', channel);

          case 8:
            if (channels.hasOwnProperty(queueName)) {
              _context7.next = 13;
              break;
            }

            _context7.next = 11;
            return createChannel();

          case 11:
            channels[queueName] = _context7.sent;

            handleError(channels[queueName]);

          case 13:
            return _context7.abrupt('return', channels[queueName]);

          case 14:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getChannel(_x5, _x6) {
    return _ref7.apply(this, arguments);
  };
}();

var runQueueOperation = exports.runQueueOperation = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(queueOperation) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return queueOperation();

          case 3:
            return _context8.abrupt('return', _context8.sent);

          case 6:
            _context8.prev = 6;
            _context8.t0 = _context8['catch'](0);
            return _context8.abrupt('return', false);

          case 9:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[0, 6]]);
  }));

  return function runQueueOperation(_x7) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getConnections = getConnections;
exports.getConnectionKey = getConnectionKey;
exports.handleConnectionError = handleConnectionError;
exports.connectAndStoreFactory = connectAndStoreFactory;
exports.storeConnectionFactory = storeConnectionFactory;
exports.connectFactory = connectFactory;
exports.assertHearthBeatSupport = assertHearthBeatSupport;
exports.addUrlParameter = addUrlParameter;
exports.punishNonExistentQueue = punishNonExistentQueue;
exports.closeChannel = closeChannel;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _lodash = require('lodash');

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connections = {};
var channels = {};
var url = require('url');

function getConnections() {
  return connections;
}

function getConnectionKey(obj) {
  return _crypto2.default.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}

function handleConnectionError(connection, needReconnect, connectAndStore) {
  connection.on('error', function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(error) {
      var newConnection;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log('ERROR', error);

              if (!(needReconnect === true)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 4;
              return connectAndStore();

            case 4:
              newConnection = _context2.sent;

              handleConnectionError(newConnection, needReconnect, connectAndStore);
              return _context2.abrupt('return', newConnection);

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
}

function connectAndStoreFactory(connect, storeConnection) {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var connection;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return connect();

          case 2:
            connection = _context3.sent;

            storeConnection(connection);
            return _context3.abrupt('return', connection);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
}

function storeConnectionFactory(key) {
  return function (connection) {
    connections[key] = connection;
  };
}

function connectFactory(connectionUrl) {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log('Connecting on: ' + connectionUrl);
            _context4.next = 3;
            return _amqplib2.default.connect(connectionUrl);

          case 3:
            return _context4.abrupt('return', _context4.sent);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
}

function assertHearthBeatSupport(connectionUrl, hearthBeatSeconds) {
  if ((0, _lodash.isInteger)(hearthBeatSeconds)) {
    return addUrlParameter(connectionUrl, 'hearthbeat', hearthBeatSeconds);
  } else {
    return connectionUrl;
  }
}

function addUrlParameter(connectionUrl, name, value) {
  var urlObject = url.parse(connectionUrl);
  var pars = urlObject.query ? urlObject.query.split('&') : [];
  pars.push(name + '=' + value);
  return [urlObject.protocol, '//', urlObject.auth, urlObject.host, urlObject.pathname, '?' + pars.join('&')].join('');
}

function handleError(channel) {
  channel.on('error', function (error) {
    if (/404/.test(error)) {} else {
      console.log('ERROR', error);
    }
  });

  channel.on('blocked', function (reason) {
    console.log('BLOCKED', reason);
  });
}

function punishNonExistentQueue(queueName, queueData) {
  if (queueData === false) {
    throw new Error('Queue "' + queueName + '" doesn\'t exist.');
  }
}

function closeChannel(channel) {
  try {
    return channel.closeChannel();
  } catch (err) {
    return false;
  }
}