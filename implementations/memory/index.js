import rr from 'rr';
import shortid from 'shortid';

export default function memoryQueueService(config, logger) {

  const queues = {};
  let consumersChanged = false;

  return Object.freeze({
    getChannelAssert,
    consume,
    publish,
    exists,
    remove,
    removeIfExists,
    purge,
    purgeIfExists,
    messageCount,
    consumerCount
  });

  function getChannelAssert(queueName) {
    if (!queues.hasOwnProperty(queueName)) {
      queues[queueName] = {
        messages: [],
        consumers: {},
        consumersArray: []
      }
    }
  }

  function exists(queueName) {
    return queues.hasOwnProperty(queueName);
  }

  function remove(queueName) {
    delete queues[queueName];
  }

  function removeIfExists(queueName) {
    if (exists(queueName)) {
      remove(queueName);
    }
  }

  function purge(queueName) {
    if (exists(queueName)) {
      queues[queueName].messages = [];
    }
  }

  function purgeIfExists(queueName) {
    if (exists(queueName)) {
      purge(queueName);
    }
  }

  function publish(queueName, message) {
    getChannelAssert(queueName);
    pushMessage(queueName, message);
    process.nextTick(() => dispatchMessages(queueName));
    return true;
  }

  async function consume(queueName, consumer) {
    getChannelAssert(queueName);
    const consumerId = addConsumer(queueName, consumer);
    const removeConsumer = createRemoveConsumer(queueName, consumerId);
    process.nextTick(() => dispatchMessages(queueName, removeConsumer));
    return removeConsumer;
  }

  function addConsumer(queueName, consumer) {
    const consumerId = shortid.generate();
    queues[queueName].consumers[consumerId] = consumer;
    consumersChanged = true;
    return consumerId;
  }

  function createRemoveConsumer(queueName, consumerId) {
    return () => {
      delete queues[queueName].consumers[consumerId];
      consumersChanged = true;
    };
  }

  async function dispatchMessages(queueName, removeConsumer) {
    while (consumerCount(queueName) && messageCount(queueName)) {
      await dispatchOneMessage(queueName, chooseConsumer(queueName), removeConsumer);
    }
  }

  function chooseConsumer(queueName) {
    if (consumersChanged) {
      queues[queueName].consumersArray = Object.values(queues[queueName].consumers)
    }
    return rr(queues[queueName].consumersArray);
  }

  async function dispatchOneMessage(queueName, consumer, removeConsumer) {
    const message = getFirstMessage(queueName);
    try {
      await consumer(message, createNack(queueName, message));
    } catch (err) {
      logger.error('Consumer is removed because it has thrown error:');
      logger.error(err)
      removeConsumer();
    }
  }

  function createNack(queueName, message) {
    return () => {
      queues[queueName].messages.push(message);
    }
  }

  function getFirstMessage(queueName) {
    return queues[queueName].messages.shift()
  }

  function pushMessage(queueName, message) {
    queues[queueName].messages.push(message);
  }

  function messageCount(queueName) {
    return queues[queueName].messages.length;
  }

  function consumerCount(queueName) {
    return Object.values(queues[queueName].consumers).length;
  }

}
