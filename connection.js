import crypto from 'crypto';
import amqp from 'amqplib';
import { isInteger, defaults, values } from 'lodash';
const connections = {};
const channels = {};
const url = require('url');

export async function getConnection(config) {
  const connectionKey = getConnectionKey(config);
  if (!connections.hasOwnProperty(connectionKey)) {
    const connectionUrl = assertHearthBeatSupport(config.url, config.hearthbeat);
    const connect = connectFactory(connectionUrl);
    const storeConnection = storeConnectionFactory(connectionKey);
    const connectAndStore = connectAndStoreFactory(connect, storeConnection);
    const connection = await connectAndStore();
    connection.__key = connectionKey;
    handleConnectionError(connection, config.reconnect, connectAndStore);
  }
  return connections[connectionKey];
}

export function getConnections() {
  return connections;
}

export function getConnectionKey(obj) {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}

export function handleConnectionError(connection, needReconnect, connectAndStore) {
  connection.on('error', async function(error) {
    console.log('ERROR', error);
    if (needReconnect === true) {
      const newConnection = await connectAndStore();
      handleConnectionError(newConnection, needReconnect, connectAndStore);
      return newConnection;
    }
  });
}

export function connectAndStoreFactory(connect, storeConnection) {
  return async function() {
    const connection = await connect();
    storeConnection(connection);
    return connection;
  }
}

export function storeConnectionFactory(key) {
  return connection => {
    connections[key] = connection;
  };
}

export function connectFactory(connectionUrl) {
  return async function () {
    console.log('Connecting on: '+connectionUrl);
    return await amqp.connect(connectionUrl);
  }
}

export function assertHearthBeatSupport(connectionUrl, hearthBeatSeconds) {
  if (isInteger(hearthBeatSeconds)) {
    return addUrlParameter(connectionUrl, 'hearthbeat', hearthBeatSeconds);
  } else {
    return connectionUrl;
  }
}

export function addUrlParameter(connectionUrl, name, value) {
  const urlObject = url.parse(connectionUrl);
  const pars =  urlObject.query ? urlObject.query.split('&') : [];
  pars.push(`${name}=${value}`);
  return [
    urlObject.protocol,
    '//',
    urlObject.auth,
    urlObject.host,
    urlObject.pathname,
    '?' + pars.join('&')
  ].join('');
}

export async function closeConnections() {
  await Promise.all(values(connections).map(closeConnection));
}

export async function closeConnection(connection) {
  try {
    await connection.close();
    deleteConnection(connection.__key);
  } catch (err) {
    return true;
  }
}

export async function getChannel(queueName, createChannel, forceNewChannel=false) {
function deleteConnection(connectionKey) {
  delete connections[connectionKey];
}

  if (forceNewChannel) {
    const channel = await createChannel();
    return channel;
  } else if (!channels.hasOwnProperty(queueName)) {
    channels[queueName] = await createChannel();
  }
  return channels[queueName];
}

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

export function punishNonExistentQueue(queueName, queueData) {
  if (queueData === false) {
    throw new Error(`Queue "${queueName}" doesn\'t exist.`);
  }
}

export async function runQueueOperation(queueOperation) {
  try {
    return await queueOperation();
  } catch(err) {
    return false;
  }
}

export function closeChannel(channel) {
  try {
    return channel.closeChannel();
  } catch(err) {
    return false;
  }
}
