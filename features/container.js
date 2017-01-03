import di from 'lab-di';
import config from 'lab-config';
import configMemory from 'lab-config/implementations/memory';
import queue from '../index';

const container = di();
container.registerModule(config, 'config');
container.registerModule(configMemory, 'lab-config-memory');
container.registerModule(queue, 'queue');

module.exports = container;
