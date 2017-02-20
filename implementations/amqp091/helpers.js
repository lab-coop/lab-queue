const cancelConsumingCallbacks = {};

function assertCancelConsumingCallbacks(queueName) {
  if (!cancelConsumingCallbacks.hasOwnProperty(queueName)) {
    cancelConsumingCallbacks[queueName] = [];
  }
}

export function addCancelConsuming(queueName, cancelConsuming) {
  assertCancelConsumingCallbacks(queueName);
  cancelConsumingCallbacks[queueName].push(cancelConsuming);
}

export async function runAllCancelConsuming(queueName) {
  assertCancelConsumingCallbacks(queueName);
  await Promise.all(cancelConsumingCallbacks[queueName].map(cancelConsuming => cancelConsuming()));
}

export function ackFactory(channel) {
  return message => channel.ack(message);
}

export function nackFactory(channel) {
  return message => channel.nack(message);
}
