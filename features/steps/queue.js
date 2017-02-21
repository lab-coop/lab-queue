import q from 'q';
import chai from 'chai';
import spies from 'chai-spies';
chai.use(spies);
const assert = chai.assert;
const expect = chai.expect;

module.exports = function() {
  const container = this.container;
  const context = this.context;

  let callbacks;
  let callbackIndex;
  function resetCallbacks() {
    callbacks = [];
    callbackIndex = 0;
    for (let i = 0; i < 100; i++) {
      callbacks.push(q.defer());
    }
  }

  function asyncCallbackCounter(message) {
    callbacks[callbackIndex++].resolve(message);
  }

  function waitForXCallbacks(num) {
    return Promise.all(callbacks.slice(0, num).map(defer => defer.promise));
  }

  this.Given('"$queueName" doesn\'t exist', async function (queueName) {
    const queue = await container.queue;
    await queue.removeIfExists(queueName);
  });

  this.Given('"$queueName" is an empty, existing queue, without consumer', async function (queueName) {
    const queue = await container.queue;
    await queue.removeIfExists(queueName);
    await queue.getChannelAssert(queueName);
  });

  this.When('"$queueName" is purged', async function (queueName) {
    const queue = await container.queue;
    await queue.purge(queueName);
  });

  this.When('a random message pushed to queue "$queueName"', async function (queueName) {
    const queue = await container.queue;
    assert((await queue.publish(queueName, true)), "Expected publish to return truthy");
  });

  this.When('the message "$message" is pushed to queue "$queueName"', async function (message, queueName) {
    const queue = await container.queue;
    assert((await queue.publish(queueName, message)), "Expected publish to return truthy");
  });

  this.When('a consumer is attached to queue "$queueName"', async function (queueName) {
    const queue = await container.queue;
    resetCallbacks();
    context.consumerCallback = chai.spy(asyncCallbackCounter);
    context.cancelConsume = await queue.consume(queueName, context.consumerCallback);
    expect(context.cancelConsume).to.be.a('function');
  });

  this.When('a consumer is attached to queue "$queueName" and immediately cancelled', async function (queueName) {
    const queue = await container.queue;
    resetCallbacks();
    context.consumerCallback = chai.spy(asyncCallbackCounter);
    (await queue.consume(queueName, context.consumerCallback))();
  });

  this.When('"$queueName" contains $messageCount message, catch errors', async function (queueName, messageCount) {
    messageCount = parseInt(messageCount);
    const queue = await container.queue;
    this.thrown = false;
    try {
      const checkResult = await queue.messageCount(queueName);
      expect(checkResult).to.equal(messageCount);
      // return assert(checkResult === messageCount, "Expected checkResult to equal messageCount");
    } catch(err) {
      console.log(err);
      this.thrown = true;
    }
  });

  this.Then('"$queueName" has $consumerCount consumer, catch errors', async function (queueName, consumerCount) {
    consumerCount = parseInt(consumerCount);
    const queue = await container.queue;
    this.thrown = false;
    try {
      const checkResult = await queue.consumerCount(queueName);
      return assert(checkResult === consumerCount, "Expected checkResult to equal consumerCount");
    } catch(err) {
      console.log(err);
      this.thrown = true;
    }
  });

  this.When('"$queueName" contains $messageCount message', async function (queueName, messageCount) {
    messageCount = parseInt(messageCount);
    const queue = await container.queue;
    const checkResult = await queue.messageCount(queueName);
    expect(checkResult).to.equal(messageCount);
  });

  this.Then('"$queueName" has $consumerCount consumer', async function (queueName, consumerCount) {
    consumerCount = parseInt(consumerCount);
    const queue = await container.queue;
    const checkResult = await queue.consumerCount(queueName);
    return assert(checkResult === consumerCount, "Expected checkResult to equal consumerCount");
  });

  this.Then('the last operation thrown error', async function () {
    const queue = await container.queue;
    assert(this.thrown === true, "Expected a thing to be thrown");
  });

  this.Then('the consumer is called back with "$message"', async function (message) {
    await waitForXCallbacks(1);
    expect(context.consumerCallback).to.be.called.with(message);
  });

  this.Then('the consumer is called back "$times" times', async function (times) {
    await waitForXCallbacks(parseInt(times));
    expect(context.consumerCallback).to.be.called.exactly(parseInt(times));
  });

};
