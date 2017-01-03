'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get(key) {
    return _lodash2.default.get({
      consume: {
        defaults: {
          prefetchCount: 1
        }
      }
    }, key);
  }
};