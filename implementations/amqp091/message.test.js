import {
  handle
} from './message';

it('should ack if sync messageHandler run without error', async () => {
  const ack = jest.fn();
  const nack = jest.fn();
  const errorLogger = jest.fn();
  const messageHandler = jest.fn(() => {});
  const message = {
    content: JSON.stringify('test')
  };
  await handle(messageHandler, ack, nack, errorLogger)(message);
  expect(messageHandler.mock.calls.length).toBe(1);
  expect(ack.mock.calls.length).toBe(1);
  expect(nack.mock.calls.length).toBe(0);
  expect(errorLogger.mock.calls.length).toBe(0);
});

it('should ack if async messageHandler run without error', async () => {
  const ack = jest.fn();
  const nack = jest.fn();
  const errorLogger = jest.fn();
  const messageHandler = jest.fn(async () => { await 1; });
  const message = {
    content: JSON.stringify('test')
  };
  await handle(messageHandler, ack, nack, errorLogger)(message);
  expect(messageHandler.mock.calls.length).toBe(1);
  expect(ack.mock.calls.length).toBe(1);
  expect(nack.mock.calls.length).toBe(0);
  expect(errorLogger.mock.calls.length).toBe(0);
});

it('should nack and log error if sync messageHandler throws error', async () => {
  const ack = jest.fn();
  const nack = jest.fn();
  const errorLogger = jest.fn();
  const messageHandler = jest.fn(() => { throw new Error(1); });
  const message = {
    content: JSON.stringify('test')
  };
  await handle(messageHandler, ack, nack, errorLogger)(message);
  expect(messageHandler.mock.calls.length).toBe(1);
  expect(ack.mock.calls.length).toBe(0);
  expect(nack.mock.calls.length).toBe(1);
  expect(errorLogger.mock.calls.length).toBe(1);
});

it('should nack and log error if async messageHandler throws error', async () => {
  const ack = jest.fn();
  const nack = jest.fn();
  const errorLogger = jest.fn();
  const messageHandler = jest.fn(async () => { await 1; throw new Error(1); });
  const message = {
    content: JSON.stringify('test')
  };
  await handle(messageHandler, ack, nack, errorLogger)(message);
  expect(messageHandler.mock.calls.length).toBe(1);
  expect(ack.mock.calls.length).toBe(0);
  expect(nack.mock.calls.length).toBe(1);
  expect(errorLogger.mock.calls.length).toBe(1);
});


