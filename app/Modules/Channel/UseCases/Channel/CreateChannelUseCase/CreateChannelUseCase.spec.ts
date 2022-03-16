import test from 'japa';

import { ChannelsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelsRepositoryInMemory';
import { CreateChannelUseCase } from './CreateChannelUseCase';
import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import AppException from 'App/Shared/Exceptions/AppException';

let channelsRepositoryInMemory: ChannelsRepositoryInMemory;
let createChannelUseCase: CreateChannelUseCase;

test.group('Create Channel', (group) => {
  group.beforeEach(() => {
    channelsRepositoryInMemory = new ChannelsRepositoryInMemory();
    createChannelUseCase = new CreateChannelUseCase(channelsRepositoryInMemory);
  });

  test('it should be able to create a new channel', async (assert) => {
    const data: IChannel.DTO.Store = {
      title: 'channel_title',
      description: 'channel_description',
      user_id: 923,
    };

    const channel = await createChannelUseCase.execute(data);

    assert.property(channel, 'id');
    assert.property(channel, 'title');
    assert.property(channel, 'description');
  });

  test('it should not be able to create a channel if user already has a channel', async (assert) => {
    const data: IChannel.DTO.Store = {
      title: 'channel_title',
      description: 'channel_description',
      user_id: 923,
    };

    await channelsRepositoryInMemory.store({
      title: 'another_channel_title',
      description: 'another_channel_description',
      user_id: data.user_id,
    });

    try {
      await createChannelUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
