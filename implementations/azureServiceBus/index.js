import azure from 'azure'
import bluebird from 'bluebird'

export default (config) => {


  const serviceBusConnectionString = config.get('serviceBusConnectionString')
  const serviceBus = azure.createServiceBusService(serviceBusConnectionString)

  const sendMessageAsync = bluebird.promisify(serviceBus.sendQueueMessage, {context: serviceBus})

  const deleteMessageAsync = bluebird.promisify(serviceBus.deleteMessage, {context: serviceBus})
  const deleteMessageAsyncCurried = (lockedMessage) => () => deleteMessageAsync(lockedMessage)

  const consume = (queueName, handler) => {
    serviceBus.receiveQueueMessage(queueName, { isPeekLock: true }, function(error, lockedMessage) {
      if(error) throw error
      const deleteMessage = deleteMessageAsyncCurried(lockedMessage)
      const payload = JSON.parse(lockedMessage.body)
      handler(payload)
        .then(deleteMessage)
        .catch((err) => {throw err})
    });
  }

  const publish = async (queueName, payload) => {
    const message = { body: JSON.stringify(payload) }
    await sendMessageAsync(queueName, message)
  }

  return Object.freeze({
    consume,
    publish,
  })
}
