export default (config) => {
  const implementationName = config.get('queueService') || 'amqp091';
  return require(`./implementations/${implementationName}`).default(config)
}
