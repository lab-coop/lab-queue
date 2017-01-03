'use strict';

module.exports = function () {
  this.context = {};
  this.container = require('../container');
  setupConfig(this.container.get('config'));
};

function setupConfig(config) {
  // config.update('newsService','memory');
}