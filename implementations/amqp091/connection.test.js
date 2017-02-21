import {
  getConnection,
  getConnections,
  closeConnection,
  closeConnections,
  assertHeartBeatSupport,
} from './connection';

const connectionConfigs = [
  {
    name: 1
  }, {
    name: 2
  }
];

afterEach(async function() {
  await closeConnections();
});

it('should add heartbeat parameter', () => {
  expect(assertHeartBeatSupport('amqp://localhost')).toBe('amqp://localhost');
  expect(assertHeartBeatSupport('amqp://localhost', false)).toBe('amqp://localhost');
  expect(assertHeartBeatSupport('amqp://localhost', true)).toBe('amqp://localhost');
  expect(assertHeartBeatSupport('amqp://localhost', 10)).toBe('amqp://localhost?heartbeat=10');
});

it('should create a connection', async function() {
  await getConnection(connectionConfigs[0]);
  expect(Object.keys(getConnections())).toHaveLength(1);
});

it('should close a single connection', async function() {
  const connection = await getConnection(connectionConfigs[0]);
  await closeConnection(connection);
  expect(Object.keys(getConnections())).toHaveLength(0);
});

it('shouldn\'t complain to close an already closed connection', async function() {
  const connection = await getConnection(connectionConfigs[0]);
  await closeConnection(connection);
  await closeConnection(connection);
});

describe('getConnection', () => {
  it('should reuse an already established connection', async function() {
    await getConnection(connectionConfigs[0]);
    await getConnection(connectionConfigs[0]);
    expect(Object.keys(getConnections())).toHaveLength(1);
  });

  it('should create a new connection if the connection string differs', async function() {
    await getConnection(connectionConfigs[0]);
    await getConnection(connectionConfigs[0]);
    await getConnection(connectionConfigs[1]);
    expect(Object.keys(getConnections())).toHaveLength(2);
  });
});

