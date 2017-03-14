import tools from 'lab-di/tools';

const diTools = tools();
const di = diTools.getDI();

di.registerModule(require('lab-config'), 'config');
di.registerModule(require('lab-config/implementations/memory'), 'config-memory');
di.registerModule(require('lab-config/implementations/file'), 'config-file');

function logger() {
  return () => ({
    info: console.log,
    error: console.log,
    debug: console.log
  })
}

di.registerModule(logger, 'logger');
diTools.registerModuleDir(__dirname+'/../', 'queue');

const config = di.container.get('config');
config.update('queue', 'memory');

module.exports = di.container;
