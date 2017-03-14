function Queue(container) {
  const implementation = container.get('config').get(Queue.serviceName);
  return container.getImplementation(Queue.serviceName, implementation);
}

Queue.type = 'factory';
module.exports = Queue;
