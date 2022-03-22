import { StreamingsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/StreamingsRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { FinishStreamingUseCase } from './FinishStreamingUseCase';

let streamingsRepositoryInMemory: StreamingsRepositoryInMemory;
let finishStreamingUseCase: FinishStreamingUseCase;

test.group('Finish streaming', (group) => {
  group.beforeEach(() => {
    streamingsRepositoryInMemory = new StreamingsRepositoryInMemory();
    finishStreamingUseCase = new FinishStreamingUseCase(streamingsRepositoryInMemory);
  });

  test('it should be able to finish a streaming', async (assert) => {
    const streaming = await streamingsRepositoryInMemory.store({
      channel_id: 1,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    });

    await finishStreamingUseCase.execute(streaming.id);

    const foundStreaming = await streamingsRepositoryInMemory.findBy('id', streaming.id);

    if (foundStreaming) {
      assert.property(foundStreaming, 'finished_at');
      assert.isNotNull(foundStreaming.finished_at);
    }
  });

  test('it should not be able to finish a streaming if it is already finished', async (assert) => {
    const streaming = await streamingsRepositoryInMemory.store({
      channel_id: 1,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    });

    await finishStreamingUseCase.execute(streaming.id);

    try {
      await finishStreamingUseCase.execute(streaming.id);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });

  test('it should not be able to finish a streaming if it does not exists', async (assert) => {
    try {
      await finishStreamingUseCase.execute(6328);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
