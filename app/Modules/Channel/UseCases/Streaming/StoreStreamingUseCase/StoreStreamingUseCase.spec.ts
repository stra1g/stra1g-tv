import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { ChannelsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelsRepositoryInMemory';
import { StreamingsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/StreamingsRepositoryInMemory';
import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { StoreStreamingUseCase } from './StoreStreamingUseCase';

let streamingsRepositoryInMemory: StreamingsRepositoryInMemory;
let channelsRepositoryInMemory: ChannelsRepositoryInMemory;
let storeStreamingUseCase: StoreStreamingUseCase;

test.group('Store Streaming', (group) => {
  group.beforeEach(() => {
    streamingsRepositoryInMemory = new StreamingsRepositoryInMemory();
    channelsRepositoryInMemory = new ChannelsRepositoryInMemory();
    storeStreamingUseCase = new StoreStreamingUseCase(
      streamingsRepositoryInMemory,
      channelsRepositoryInMemory
    );
  });

  test('it should be able to create a new streaming', async (assert) => {
    const channel = await channelsRepositoryInMemory.store({
      description: 'channel description',
      name: 'channel name',
      stream_key: '123456',
      user_id: 1,
    });

    const data: IStreaming.DTO.Store = {
      channel_id: channel.id,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    };

    const streamingResponse = await storeStreamingUseCase.execute(data);

    assert.property(streamingResponse, 'streaming');
    assert.property(streamingResponse.streaming, 'description');
    assert.property(streamingResponse.streaming, 'title');
    assert.property(streamingResponse.streaming, 'created_at');
    assert.property(streamingResponse.streaming, 'id');
    assert.property(streamingResponse, 'url');
    assert.isString(streamingResponse.url);
  });

  test('it should not be able to create a new streaming with another one online to same channel', async (assert) => {
    const channel = await channelsRepositoryInMemory.store({
      description: 'channel description',
      name: 'channel name',
      stream_key: '123456',
      user_id: 1,
    });

    const data: IStreaming.DTO.Store = {
      channel_id: channel.id,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    };

    await streamingsRepositoryInMemory.store(data);

    try {
      await storeStreamingUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
