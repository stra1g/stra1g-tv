import test from 'japa';
import { stubObject } from 'ts-sinon';
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import { SimplePaginator } from '@adonisjs/lucid/build/src/Database/Paginator/SimplePaginator';
import { DateTime } from 'luxon';

import { ListUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/ListUserChannelRoleUseCase/ListUserChannelRoleUseCase';
import { ChannelRolesRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelRolesRepositoryInMemory';
import { ChannelsRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelsRepositoryInMemory';
import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

let channelsRepositoryInMemory: ChannelsRepositoryInMemory;
let channelRolesRepositoryInMemory: ChannelRolesRepositoryInMemory;
let listUserChannelRoleUseCase: ListUserChannelRoleUseCase;

test.group('Unit: List user channel role', (group) => {
  group.beforeEach(() => {
    channelsRepositoryInMemory = new ChannelsRepositoryInMemory();
    channelRolesRepositoryInMemory = new ChannelRolesRepositoryInMemory();
  });

  test('it should be able to list user channel role', async (assert) => {
    const channel = await channelsRepositoryInMemory.store({
      description: 'test description',
      name: 'test channel',
      user_id: 1,
    });

    async function listUserChannelRoleStubbed(
      _channelId: number,
      page: number,
      perPage: number
    ): Promise<SimplePaginatorContract<IChannelRole.UserChannelRoleResponse>> {
      const rows: IChannelRole.UserChannelRoleResponse[] = [
        {
          name: 'user 1',
          username: 'user1',
          role: 'owner',
          created_at: DateTime.now(),
        },
      ];

      const userChannelRoles = new SimplePaginator(rows.length, page, perPage, ...rows);

      return userChannelRoles;
    }

    const page = 1;
    const perPage = 1;

    const channelRolesRepositoryStub = stubObject<ChannelRolesRepositoryInMemory>(
      channelRolesRepositoryInMemory,
      {
        listUsersChannelRole: listUserChannelRoleStubbed(channel.id, page, perPage),
      }
    );

    listUserChannelRoleUseCase = new ListUserChannelRoleUseCase(
      channelsRepositoryInMemory,
      channelRolesRepositoryStub
    );

    const userChannelRoles = await listUserChannelRoleUseCase.execute(channel.id, page, perPage);

    assert.property(userChannelRoles, 'rows');
    assert.property(userChannelRoles[0], 'name');
    assert.property(userChannelRoles[0], 'username');
    assert.property(userChannelRoles[0], 'role');
    assert.property(userChannelRoles[0], 'created_at');
  });

  test('it should not be able to list user channel role if user does not exists', async (assert) => {
    const page = 1;
    const perPage = 1;

    listUserChannelRoleUseCase = new ListUserChannelRoleUseCase(
      channelsRepositoryInMemory,
      channelRolesRepositoryInMemory
    );

    try {
      await listUserChannelRoleUseCase.execute(10, page, perPage);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
