import { ChannelsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelsRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { ShowChannelUseCase } from './ShowChannelUseCase';

let channelsRepositoryInMemory: ChannelsRepositoryInMemory;
let showChannelUseCase: ShowChannelUseCase;

test.group('Show Channel', (group) => {
  group.beforeEach(() => {
    channelsRepositoryInMemory = new ChannelsRepositoryInMemory();
    showChannelUseCase = new ShowChannelUseCase(channelsRepositoryInMemory);
  });

  test('it should be able to show a channel', async (assert) => {
    const channel = await channelsRepositoryInMemory.store({
      description: 'test description',
      title: 'test title',
      user_id: 204,
    });

    const foundChannel = await showChannelUseCase.execute(channel.id);

    assert.property(foundChannel, 'id');
    assert.property(foundChannel, 'title');
    assert.property(foundChannel, 'description');
  });

  test('it should not be able to show a channel if does not exists', async (assert) => {
    try {
      await showChannelUseCase.execute(389);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
