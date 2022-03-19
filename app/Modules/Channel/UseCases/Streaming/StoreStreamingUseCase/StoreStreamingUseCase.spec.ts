import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { StreamingsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/StreamingsRepositoryInMemory';
import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { StoreStreamingUseCase } from './StoreStreamingUseCase';

let streamingsRepositoryInMemory: StreamingsRepositoryInMemory;
let storeStreamingUseCase: StoreStreamingUseCase;

test.group('Store Streaming', (group) => {
  group.beforeEach(() => {
    streamingsRepositoryInMemory = new StreamingsRepositoryInMemory();
    storeStreamingUseCase = new StoreStreamingUseCase(streamingsRepositoryInMemory);
  });

  test('it should be able to create a new streaming', async (assert) => {
    const data: IStreaming.DTO.Store = {
      channel_id: 1,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    };

    const streaming = await storeStreamingUseCase.execute(data);

    assert.property(streaming, 'id');
    assert.property(streaming, 'channel_id');
    assert.property(streaming, 'description');
    assert.property(streaming, 'title');
    assert.property(streaming, 'video_url');
    assert.property(streaming, 'finished_at');
  });

  test('it should not be able to create a new streaming with another one online to same channel', async (assert) => {
    const data: IStreaming.DTO.Store = {
      channel_id: 1,
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
