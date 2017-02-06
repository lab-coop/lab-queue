export default (config) => {
  const implementationName = config.get('queueService') || 'amqp';
  return require(`./implementations/${implementationName}`).default(config)
}
