import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import Channel from 'App/Modules/Channel/Models/Channel';
import { ChannelsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelsRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { UpdateChannelUseCase } from './UpdateChannelUseCase';

let channelsRepositoryInMemory: ChannelsRepositoryInMemory;
let updateChannelUseCase: UpdateChannelUseCase;

test.group('Update channel', (group) => {
  group.beforeEach(() => {
    channelsRepositoryInMemory = new ChannelsRepositoryInMemory();
    updateChannelUseCase = new UpdateChannelUseCase(channelsRepositoryInMemory);
  });

  test('it should be able to update a channel', async (assert) => {
    const userId = 83;

    const channel = await channelsRepositoryInMemory.store({
      description: 'test description',
      name: 'test name',
      user_id: userId,
    });

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    const updatedChannel = await updateChannelUseCase.execute({
      channelId: channel.id,
      payload: data,
      userId,
    });

    if (updatedChannel instanceof Channel) {
      assert.property(updatedChannel, 'id');
      assert.equal(updatedChannel.description, data.description);
      assert.equal(updatedChannel.name, data.name);
    }
  });

  test('it should not be able to update a channel if channel does not exists', async (assert) => {
    const userId = 83;

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    try {
      await updateChannelUseCase.execute({
        channelId: 2309,
        payload: data,
        userId,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });

  test('it should not be able to update a channel if user does not have access to channel', async (assert) => {
    const userId = 83;

    const channel = await channelsRepositoryInMemory.store({
      description: 'test description',
      name: 'test name',
      user_id: userId,
    });

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    try {
      await updateChannelUseCase.execute({
        channelId: channel.id,
        payload: data,
        userId: 90,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
