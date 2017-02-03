'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var di = new (require('bottlejs'))();


var config = function config() {
  return require('config');
};

di.service('config', config);
di.service('queue', _index2.default, 'config');

module.exports = di.container;