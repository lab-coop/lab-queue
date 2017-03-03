export function handle(messageHandler, ack, nack, errorLogger) {
  return async function (message) {
    if (message !== null) {
      try {
        await messageHandler(decode(message));
        ack(message);
      } catch (error) {
        nack(message);
        errorLogger(error);
      }
    } else {
      // consuming cancelled OR queue deleted
      throw new Error('Message handler called with null.');
    }
  }
}

export function encode(message) {
  return new Buffer(JSON.stringify(message));
}

export function decode(message) {
  return JSON.parse(message.content.toString());
}
