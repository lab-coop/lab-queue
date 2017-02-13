import azure from 'azure';
import bluebird from 'bluebird';
import shortid from 'shortid';

export default (config, logger) => {

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

  const serviceBusConnectionString = config.get('serviceBusConnectionString');
  const serviceBus = azure.createServiceBusService(serviceBusConnectionString);

  async function createQueueOperation(operation) {
    return bluebird.promisify(serviceBus[operation], {
      context: serviceBus
    });
  }

  async function getChannelAssert(queueName) {
    await createQueueOperation('createQueueIfNotExists')(queueName);
    if (!queues.hasOwnProperty(queueName)) {
      queues[queueName] = {
        consumers: {},
      }
    }
  }

  async function consume(queueName, handler) {
    let cancelled = false;
    while (cancelled === false) {
      const lockedMessage = await createQueueOperation('receiveQueueMessage')(queueName, { isPeekLock: true });
      const payload = JSON.parse(lockedMessage.body);
      await handler(payload);
      await createQueueOperation('deleteMessage')(lockedMessage)
    }
    return () => {
      cancelled = true;
    }

    getChannelAssert(queueName);
    const consumerId = addConsumer(queueName, consumer);
    process.nextTick(() => dispatchMessages(queueName, createRemoveConsumer(queueName, consumerId)));
    return createRemoveConsumer(queueName, consumerId);

  }

  function addConsumer(queueName, consumer) {
    getChannelAssert(queueName);
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


  function publish(queueName, payload) {
    const message = {
      body: JSON.stringify(payload)
    };
    return createQueueOperation('sendQueueMessage')(queueName, message);
  }

  async function exists(queueName) {
    return createQueueOperation('getQueue')(queueName);
  }

  async function remove(queueName) {
    return createQueueOperation('deleteQueue')(queueName);
  }

  async function removeIfExists(queueName) {
    return remove(queueName);
  }

  async function purge(queueName) {
    throw new Error('Not implemented');
  }

  async function purgeIfExists() {
    throw new Error('Not implemented');
  }

  async function consumerCount(queueName) {

  }

  async function consumerCount(queueName) {

  }

}
