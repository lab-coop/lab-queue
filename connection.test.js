import {
  getConnection,
  getConnections,
  closeConnection,
  closeConnections,
  assertHearthBeatSupport,
  getOrCreateChannel
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

it('should add hearthbeat parameter', () => {
  expect(assertHearthBeatSupport('amqp://localhost')).toBe('amqp://localhost');
  expect(assertHearthBeatSupport('amqp://localhost', false)).toBe('amqp://localhost');
  expect(assertHearthBeatSupport('amqp://localhost', true)).toBe('amqp://localhost');
  expect(assertHearthBeatSupport('amqp://localhost', 10)).toBe('amqp://localhost?hearthbeat=10');
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

it('create channel should call channel creator exactly once', async function() {
  const channelCreator = jest.fn();
  await getOrCreateChannel('test-channel', channelCreator);
  expect(channelCreator.mock.calls.length).toBe(1);
});

