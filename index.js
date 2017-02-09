export default (config) => {
  const implementationName = config.get('queue.type') || 'amqp091';
  return require(`./implementations/${implementationName}`).default(config)
}
