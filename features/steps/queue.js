import { assert } from 'chai';

module.exports = function() {
  const container = this.container;

  this.Given('"$queueName" doesn\'t exist', async function (queueName) {
    const queue = await container.get('queue');
    await queue.removeIfExists(queueName);
  });

  this.When('a random message pushed to queue "$queueName"', async function (queueName) {
    const queue = await container.get('queue');
    assert((await queue.publish(queueName, true)));
  });

  this.When('a consumer is attached to queue "$queueName"', async function (queueName) {
    const queue = await container.get('queue');
    assert((await queue.consume(queueName, () => {})));
  });

  this.Then('"$queueName" contains "$messageCount" message', async function (queueName, messageCount) {
    const queue = await container.get('queue');
    this.thrown = false;
    try {
      const checkResult = await queue.messageCount(queueName);
      console.log(checkResult);
      return assert(checkResult === messageCount);
    } catch(err) {
      console.log(err);
      this.thrown = true;
    }
  });

  this.Then('"$queueName" has "$consumerCount" consumer', async function (queueName, consumerCount) {
    const queue = await container.get('queue');
    this.thrown = false;
    try {
      const checkResult = await queue.consumerCount(queueName);
      return assert(checkResult === consumerCount);
    } catch(err) {
      this.thrown = true;
    }
  });

  this.Then('the last operation thrown error', async function () {
    const queue = await container.get('queue');
    assert(this.thrown === true);
  });

  this.Then('the last operation didn\'t throw error', async function () {
    const queue = await container.get('queue');
    assert(this.thrown === false);
  });

};


