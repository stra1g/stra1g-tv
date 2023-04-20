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
      name: 'channel_name',
      description: 'channel_description',
      user_id: 923,
      stream_key: 'any_key',
    };

    const channel = await createChannelUseCase.execute(data);

    assert.property(channel, 'id');
    assert.property(channel, 'name');
    assert.property(channel, 'description');
  });

  test('it should not be able to create a channel if user already has a channel', async (assert) => {
    const data: IChannel.DTO.Store = {
      name: 'channel_name',
      description: 'channel_description',
      user_id: 923,
      stream_key: 'anykey',
    };

    await channelsRepositoryInMemory.store({
      name: 'another_channel_name',
      description: 'another_channel_description',
      user_id: data.user_id,
      stream_key: 'anykey',
    });

    try {
      await createChannelUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
