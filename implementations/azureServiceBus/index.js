import azure from 'azure'
import bluebird from 'bluebird'

export default (config) => {


  const serviceBusConnectionString = config.get('serviceBusConnectionString')
  const serviceBus = azure.createServiceBusService(serviceBusConnectionString)

  const sendMessageAsync = bluebird.promisify(serviceBus.sendQueueMessage, {context: serviceBus})
  const receiveOneAsync = bluebird.promisify(serviceBus.receiveQueueMessage, {context: serviceBus})
  const deleteMessageAsync = bluebird.promisify(serviceBus.deleteMessage, {context: serviceBus})

  const consume = async (queueName, handler) => {
    while (true) {
      const lockedMessage = await receiveOneAsync(queueName, { isPeekLock: true })
      const payload = JSON.parse(lockedMessage.body);
      await handler(payload);
      await deleteMessageAsync(lockedMessage)
    }
  };

  const publish = async (queueName, payload) => {
    const message = { body: JSON.stringify(payload) };
    await sendMessageAsync(queueName, message)
  };

  return Object.freeze({
    consume,
    publish,
  })
}
