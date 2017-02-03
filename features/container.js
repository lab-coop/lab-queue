const di =  new (require('bottlejs'))();
import queue from '../index';

const config = function () {
  return require('config');
};

di.service('config', config);
di.service('queue', queue, 'config');

module.exports = di.container;
