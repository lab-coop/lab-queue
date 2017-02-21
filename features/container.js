const di =  new (require('bottlejs'))();
import queue from '../index';

const config = function () {
  return require('config');
};

function logger() {
  return () => ({
    info: console.log,
    error: console.log,
    debug: console.log
  })
}


di.service('config', config);
di.service('logger', logger);
di.service('queue', queue, 'config', 'logger');

module.exports = di.container;
