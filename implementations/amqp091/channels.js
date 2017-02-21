let channels = {};

export function getChannels() {
  return channels;
}

export function removeAllChannels() {
  channels = {};
}

export async function getOrCreateChannel(queueName, createChannel, forceNewChannel=false, handleChannelError) {
  if (forceNewChannel === true) {
    const channel = await createChannel();
    handleChannelError(channel);
    return channel;
  }

  if (!channels.hasOwnProperty(queueName)) {
    channels[queueName] = await createChannel();
    handleChannelError(channels[queueName]);
  }

  return channels[queueName];
}

export function handleChannelError(channel) {
  channel.on('error', error => {
    if (/404/.test(error)) {

    } else {
      console.log('ERROR', error);
    }
  });

  channel.on('blocked', reason => {
    console.log('BLOCKED', reason);
  });
}

export function closeChannel(channel) {
  try {
    return channel.closeChannel();
  } catch(err) {
    return false;
  }
}
