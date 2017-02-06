'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runQueueOperation = exports.getOrCreateChannel = exports.closeConnection = exports.closeConnections = exports.getConnection = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getConnection = exports.getConnection = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(config) {
    var connectionKey;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            connectionKey = getConnectionKey(config);

            if (!connections.hasOwnProperty(connectionKey)) {
              connections[connectionKey] = new Promise(function () {
                var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
                  var connectionUrl, connect, storeConnection, connectAndStore, connection;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          connectionUrl = assertHeartBeatSupport(config.url, config.heartbeat);
                          connect = connectFactory(connectionUrl);
                          storeConnection = storeConnectionFactory(connectionKey);
                          connectAndStore = connectAndStoreFactory(connect, storeConnection);
                          _context.next = 6;
                          return connectAndStore();

                        case 6:
                          connection = _context.sent;

                          connection.__key = connectionKey;
                          handleConnectionError(connection, config.reconnect, connectAndStore);
                          resolve(connection);

                        case 10:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x2, _x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }
            _context2.next = 4;
            return connections[connectionKey];

          case 4:
            return _context2.abrupt('return', _context2.sent);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getConnection(_x) {
    return _ref.apply(this, arguments);
  };
}();

var closeConnections = exports.closeConnections = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Promise.all((0, _lodash.values)(connections).map(closeConnection));

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function closeConnections() {
    return _ref6.apply(this, arguments);
  };
}();

var closeConnection = exports.closeConnection = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(connection) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return connection.close();

          case 3:
            deleteConnection(connection.__key);
            _context7.next = 9;
            break;

          case 6:
            _context7.prev = 6;
            _context7.t0 = _context7['catch'](0);
            return _context7.abrupt('return', true);

          case 9:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[0, 6]]);
  }));

  return function closeConnection(_x5) {
    return _ref7.apply(this, arguments);
  };
}();

var getOrCreateChannel = exports.getOrCreateChannel = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(queueName, createChannel) {
    var forceNewChannel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!forceNewChannel) {
              _context8.next = 4;
              break;
            }

            return _context8.abrupt('return', createChannel());

          case 4:
            if (channels.hasOwnProperty(queueName)) {
              _context8.next = 8;
              break;
            }

            _context8.next = 7;
            return createChannel();

          case 7:
            channels[queueName] = _context8.sent;

          case 8:
            return _context8.abrupt('return', channels[queueName]);

          case 9:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function getOrCreateChannel(_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();

var runQueueOperation = exports.runQueueOperation = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(queueOperation) {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return queueOperation();

          case 3:
            return _context9.abrupt('return', _context9.sent);

          case 6:
            _context9.prev = 6;
            _context9.t0 = _context9['catch'](0);
            return _context9.abrupt('return', false);

          case 9:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[0, 6]]);
  }));

  return function runQueueOperation(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getConnections = getConnections;
exports.getConnectionKey = getConnectionKey;
exports.handleConnectionError = handleConnectionError;
exports.connectAndStoreFactory = connectAndStoreFactory;
exports.storeConnectionFactory = storeConnectionFactory;
exports.connectFactory = connectFactory;
exports.assertHeartBeatSupport = assertHeartBeatSupport;
exports.addUrlParameter = addUrlParameter;
exports.getChannels = getChannels;
exports.handleChannelError = handleChannelError;
exports.punishNonExistentQueue = punishNonExistentQueue;
exports.closeChannel = closeChannel;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _lodash = require('lodash');

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
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(error) {
      var newConnection;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log('ERROR', error);

              if (!(needReconnect === true)) {
                _context3.next = 7;
                break;
              }

              _context3.next = 4;
              return connectAndStore();

            case 4:
              newConnection = _context3.sent;

              handleConnectionError(newConnection, needReconnect, connectAndStore);
              return _context3.abrupt('return', newConnection);

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
}

function connectAndStoreFactory(connect, storeConnection) {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var connection;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return connect();

          case 2:
            connection = _context4.sent;

            storeConnection(connection);
            return _context4.abrupt('return', connection);

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
}

function storeConnectionFactory(key) {
  return function (connection) {
    connections[key] = connection;
  };
}

function connectFactory(connectionUrl) {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log('Connecting on: ' + connectionUrl);
            _context5.next = 3;
            return _amqplib2.default.connect(connectionUrl);

          case 3:
            return _context5.abrupt('return', _context5.sent);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
}

function assertHeartBeatSupport(connectionUrl, heartBeatSeconds) {
  if ((0, _lodash.isInteger)(heartBeatSeconds)) {
    return addUrlParameter(connectionUrl, 'heartbeat', heartBeatSeconds);
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

function deleteConnection(connectionKey) {
  delete connections[connectionKey];
}

function getChannels() {
  return channels;
}

function handleChannelError(channel) {
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