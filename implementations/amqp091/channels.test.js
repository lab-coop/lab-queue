import {
  getChannels,
  getOrCreateChannel,
  removeAllChannels,
  handleChannelError,
  closeChannel,
} from './channels';

describe('getOrCreateChannel', () => {

  beforeEach(() => removeAllChannels());

  it('should call channel creator exactly once', async function() {
    const channelCreator = jest.fn();
    const attachErrorHandler = jest.fn();
    await getOrCreateChannel('test-channel', channelCreator, false, attachErrorHandler);
    expect(channelCreator.mock.calls.length).toBe(1);
    expect(attachErrorHandler.mock.calls.length).toBe(1);
  });

  it('should create new channel if forced out', async function() {
    let i = 0;
    const channelCreator = jest.fn(() => `thisischannel${++i}`);

    const attachErrorHandler = jest.fn();
    let channel;
    channel = await getOrCreateChannel('test-channel', channelCreator, true, attachErrorHandler);
    expect(channel).toBe('thisischannel1');

    channel = await getOrCreateChannel('test-channel', channelCreator, true, attachErrorHandler);
    expect(channel).toBe('thisischannel2');

    channel = await getOrCreateChannel('test-channel', channelCreator, false, attachErrorHandler);
    expect(channel).toBe('thisischannel3');

    channel = await getOrCreateChannel('test-channel', channelCreator, false, attachErrorHandler);
    expect(channel).toBe('thisischannel3');

    expect(channelCreator.mock.calls.length).toBe(3);
    expect(attachErrorHandler.mock.calls.length).toBe(3);
  });
});

