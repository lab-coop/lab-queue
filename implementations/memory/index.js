const queues = {}

const ensureQueue = (queueName) => queues[queueName] || (queues[queueName] = {
  thingsPassedToPublish: [],
  thingsPassedToConsume: [],
})

export default (config) => ({
  removeIfExists: (queueName) => {
    delete queues[queueName]
  },
  publish: (queueName, noIdeaWhatThisArgumentIs) => {
    ensureQueue(queueName)
    queues[queueName].thingsPassedToPublish.push(noIdeaWhatThisArgumentIs)
    return true
  },
  messageCount: (queueName) => {
    return queues[queueName].thingsPassedToPublish.length
  },
  consume: (queueName, noIdeaWhatThisArgumentIs) => {
    ensureQueue(queueName)
    queues[queueName].thingsPassedToConsume.push(noIdeaWhatThisArgumentIs)
    return true
  },
  consumerCount: (queueName) => {
    return queues[queueName].thingsPassedToConsume.length
  }
})
