export default (config) => {
  const implementationName = config.get('queueService') || 'ampq';
  return require(`./implementations/${implementationName}`).default(config)
}
