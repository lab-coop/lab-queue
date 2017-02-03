const queues = {}

const ensureQueue = (queueName) => queues[queueName] || (queues[queueName] = {
  messages: [],
  consumers: [],
})

const dispatchMessages = (queueName) => queues[queueName].consumers.length &&
  queues[queueName].messages.forEach(queues[queueName].consumers[0])

export default (config) => ({
  removeIfExists: (queueName) => {
    delete queues[queueName]
  },
  publish: (queueName, message) => {
    ensureQueue(queueName)
    queues[queueName].messages.push(message)
    dispatchMessages(queueName)
    return true
  },
  messageCount: (queueName) => {
    return queues[queueName].messages.length
  },
  consume: (queueName, handler) => {
    ensureQueue(queueName)
    queues[queueName].consumers.push(handler)
    dispatchMessages(queueName)
    return true
  },
  consumerCount: (queueName) => {
    return queues[queueName].consumers.length
  }
})
