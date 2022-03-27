import test from 'japa';
import { stubObject } from 'ts-sinon';

import { StoreUserChannelRoleUseCase } from './StoreUserChannelRoleUseCase';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/UsersRepositoryInMemory';
import { ChannelRolesRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelRolesRepositoryInMemory';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let channelRolesRepositoryInMemory: ChannelRolesRepositoryInMemory;
let storeUserChannelRoleUseCase: StoreUserChannelRoleUseCase;

test.group('Unit: Store user channel role', (group) => {
  group.beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    channelRolesRepositoryInMemory = new ChannelRolesRepositoryInMemory();
  });

  test('it should be able to store a new user channel role', async () => {
    const data = {
      email: 'test@email.com',
      name: 'Test name',
      password: '123456',
      username: 'tester',
    };

    const user = await usersRepositoryInMemory.store(data);
    const channelRole = await channelRolesRepositoryInMemory.store({
      role: 'test',
      description: 'test channel role',
    });

    async function findUserChannelRole() {
      return null;
    }

    async function storeUserChannelRoleStubbed() {}

    const channelRolesRepositoryStub = stubObject<ChannelRolesRepositoryInMemory>(
      channelRolesRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
        storeUserChannelRole: storeUserChannelRoleStubbed(),
      }
    );

    storeUserChannelRoleUseCase = new StoreUserChannelRoleUseCase(
      channelRolesRepositoryStub,
      usersRepositoryInMemory
    );

    await storeUserChannelRoleUseCase.execute({
      channelId: 1,
      channelRoleId: channelRole.id,
      userId: user.id,
    });
  });
});
