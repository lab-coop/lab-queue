const queues = {}

const ensureQueue = (queueName) => queues[queueName] || (queues[queueName] = {
  messages: [],
  consumers: [],
})

const dispatchMessages = (queueName) => queues[queueName].consumers.length &&
  queues[queueName].messages.forEach(queues[queueName].consumers[0])

export default (config) => ({
  removeIfExists: async (queueName) => {
    delete queues[queueName]
  },
  publish: async (queueName, message) => {
    ensureQueue(queueName)
    queues[queueName].messages.push(message)
    dispatchMessages(queueName)
    return true
  },
  messageCount: async (queueName) => {
    return queues[queueName].messages.length
  },
  consume: async (queueName, handler) => {
    ensureQueue(queueName)
    queues[queueName].consumers.push(handler)
    dispatchMessages(queueName)
    return true
  },
  consumerCount: async (queueName) => {
    return queues[queueName].consumers.length
  }
})
