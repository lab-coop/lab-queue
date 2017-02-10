import rr from 'rr';
import shortid from 'shortid';

export default function memoryQueueService(config) {

  const queues = {};
  let consumersChanged = false;

  return Object.freeze({
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

  function ensureQueue(queueName) {
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
    queues[queueName].messages = [];
  }

  function purgeIfExists(queueName) {
    if (exists(queueName)) {
      purge(queueName);
    }
  }

  function publish(queueName, message) {
    ensureQueue(queueName);
    pushMessage(queueName, message);
    process.nextTick(() => dispatchMessages(queueName));
    return true;
  }

  async function consume(queueName, consumer) {
    ensureQueue(queueName);
    const consumerId = addConsumer(queueName, consumer);
    process.nextTick(() => dispatchMessages(queueName));
    return () => removeConsumer(queueName, consumerId);
  }

  function addConsumer(queueName, consumer) {
    const consumerId = shortid.generate();
    queues[queueName].consumers[consumerId] = consumer;
    consumersChanged = true;
    return consumerId;
  }

  function removeConsumer(queueName, consumerId) {
    delete queues[queueName].consumers[consumerId];
    consumersChanged = true;
  }

  async function dispatchMessages(queueName) {
    while (consumerCount(queueName) && messageCount(queueName)) {
      await dispatchOneMessage(queueName, chooseConsumer(queueName));
    }
  }

  function chooseConsumer(queueName) {
    if (consumersChanged) {
      queues[queueName].consumersArray = Object.values(queues[queueName].consumers)
    }
    return rr(queues[queueName].consumersArray);
  }

  async function dispatchOneMessage(queueName, consumer) {
    const message = getFirstMessage(queueName);
    try {
      await consumer(message);
    } catch (err) {
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
