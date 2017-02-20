import { handle as handleMessage, encode } from './message';
import {
  getConnection,
  getOrCreateChannel,
  handleChannelError,
  closeChannel,
  punishNonExistentQueue,
  runQueueOperation,
} from './connection';

import {
  addCancelConsuming,
  runAllCancelConsuming,
  ackFactory,
  nackFactory
} from './helpers';

import shortid from 'shortid';
import { pick } from 'lodash';

function queueService(config, logger) {

  return Object.freeze({
    getChannelAssert,
    consume,
    publish,
    exists,
    remove,
    removeIfExists,
    cancelAllConsuming,
    purge,
    purgeIfExists,
    messageCount,
    consumerCount
  });

  async function consume(queueName, messageHandler, options = config.get('queue.consume.defaults')) {
    const channel = await getChannelAssert(queueName);
    await channel.prefetch(options.prefetchCount);
    const consumerOptions = pick(options, ['noLocal', 'noAck', 'exclusive', 'priority', 'arguments']);
    consumerOptions.consumerTag = shortid.generate();
    channel.consume(queueName, handleMessage(messageHandler, ackFactory(channel), nackFactory(channel, logger.error)), consumerOptions);
    const cancelConsuming = cancelConsumeFactory(channel, consumerOptions.consumerTag);
    addCancelConsuming(queueName, cancelConsuming);
    return cancelConsuming;
  }

  async function publish(queueName, message) {
    const channel = await getChannelAssert(queueName);
    return channel.sendToQueue(queueName, encode(message));
  }

  async function exists(queueName) {
    return (await check(queueName)).hasOwnProperty('queue');
  }

  async function messageCount(queueName) {
    const queueData = await check(queueName);
    punishNonExistentQueue(queueName, queueData);
    return queueData.messageCount;
  }

  async function consumerCount(queueName) {
    const queueData = await check(queueName);
    punishNonExistentQueue(queueName, queueData);
    return queueData.consumerCount;
  }

  async function check(queueName) {
    return safeQueueOperation(queueName, checkQueueFactory(queueName));
  }

  function checkQueueFactory(queueName) {
    return channel => channel.checkQueue(queueName);
  }

  async function remove(queueName) {
    await runAllCancelConsuming(queueName);
    const channel = await getChannel(queueName);
    return removeQueueFactory(queueName)(channel);
  }

  async function removeIfExists(queueName) {
    await runAllCancelConsuming(queueName);
    return safeQueueOperation(queueName, removeQueueFactory(queueName));
  }

  async function cancelAllConsuming(queueName) {
    await runAllCancelConsuming(queueName);
  }

  function removeQueueFactory(queueName) {
    return channel => channel.deleteQueue(queueName);
  }

  async function purge(queueName) {
    return safeQueueOperation(queueName, purgeQueueFactory(queueName));
    const channel = await getChannel(queueName);
    return purgeQueueFactory(queueName)(channel);
  }

  function purgeIfExists(queueName) {
  }

  function purgeQueueFactory(queueName) {
    return channel => channel.purgeQueue(queueName);
  }

  async function safeQueueOperation(queueName, queueOperation) {
    const channel = await getChannel(queueName, true);
    const queueOperationResult = await runQueueOperation(() => queueOperation(channel));
    await closeChannel(channel);
    return queueOperationResult;
  }

  async function getChannelAssert(queueName) {
    const channel = await getChannel(queueName);
    await channel.assertQueue(queueName);
    return channel;
  }

  async function getChannel(queueName, forceNew=false) {
    const channel = await getOrCreateChannel(queueName, createChannelFactory(), forceNew, handleChannelError);
    return channel;
  }

  function cancelConsumeFactory(channel, consumerTag) {
    return () => channel.cancel(consumerTag);
  }

  function createChannelFactory() {
    return async function() {
      const connection = await getConnection(config.get('queue'));
      return await connection.createChannel();
    }
  }

}

export default queueService;
