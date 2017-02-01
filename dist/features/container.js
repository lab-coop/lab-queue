'use strict';

var _labDi = require('lab-di');

var _labDi2 = _interopRequireDefault(_labDi);

var _labConfig = require('lab-config');

var _labConfig2 = _interopRequireDefault(_labConfig);

var _memory = require('lab-config/implementations/memory');

var _memory2 = _interopRequireDefault(_memory);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = (0, _labDi2.default)();
container.registerModule(_labConfig2.default, 'config');
container.registerModule(_memory2.default, 'lab-config-memory');
container.registerModule(_index2.default, 'queue');

module.exports = container;