import crypto from 'crypto';
import amqp from 'amqplib';
import { isInteger, defaults, values } from 'lodash';
const connections = {};
const url = require('url');

export async function getConnection(config) {
  const connectionKey = getConnectionKey(config);
  if (!connections.hasOwnProperty(connectionKey)) {
    connections[connectionKey] = new Promise(async function(resolve, reject) {
      const connectionUrl = assertHeartBeatSupport(config.url, config.heartbeat);
      const connect = connectFactory(connectionUrl);
      const storeConnection = storeConnectionFactory(connectionKey);
      const connectAndStore = connectAndStoreFactory(connect, storeConnection);
      const connection = await connectAndStore();
      connection.__key = connectionKey;
      handleConnectionError(connection, config.reconnect, connectAndStore);
      resolve(connection);
    });
  }
  return await connections[connectionKey];
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
    console.log('Connecting to: '+connectionUrl);
    return await amqp.connect(connectionUrl);
  }
}

export function assertHeartBeatSupport(connectionUrl, heartBeatSeconds) {
  if (isInteger(heartBeatSeconds)) {
    return addUrlParameter(connectionUrl, 'heartbeat', heartBeatSeconds);
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
    urlObject.auth ? '@' : '',
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

function deleteConnection(connectionKey) {
  delete connections[connectionKey];
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
    console.log(err);
    return false;
  }
}
