import test from 'japa';
import { stubObject } from 'ts-sinon';
import { DateTime } from 'luxon';

import { StoreUserChannelRoleUseCase } from './StoreUserChannelRoleUseCase';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/UsersRepositoryInMemory';
import { ChannelRolesRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelRolesRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import AppException from 'App/Shared/Exceptions/AppException';

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

  test('it should not be able to store a new user channel role if user does not exists', async (assert) => {
    const channelRole = await channelRolesRepositoryInMemory.store({
      role: 'test',
      description: 'test channel role',
    });

    storeUserChannelRoleUseCase = new StoreUserChannelRoleUseCase(
      channelRolesRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await storeUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: channelRole.id,
        userId: 1,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });

  test('it should not be able to store a new user channel role if channelRole does not exists', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'Test name',
      password: '123456',
      username: 'tester',
    });

    storeUserChannelRoleUseCase = new StoreUserChannelRoleUseCase(
      channelRolesRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await storeUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: 1,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });

  test('it should not be able to store a new user channel role if channelRole is owner', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'Test name',
      password: '123456',
      username: 'tester',
    });

    const channelRole = await channelRolesRepositoryInMemory.store({
      role: 'owner',
      description: 'Owner',
    });

    storeUserChannelRoleUseCase = new StoreUserChannelRoleUseCase(
      channelRolesRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await storeUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: channelRole.id,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });

  test('it should not be able to store userChannelRole if user has other channelRole in same channel', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'Test name',
      password: '123456',
      username: 'tester',
    });

    const channelRole = await channelRolesRepositoryInMemory.store({
      role: 'test',
      description: 'test channel role',
    });

    async function findUserChannelRole() {
      return {
        id: 1,
        user_id: user.id,
        channel_id: 1,
        channel_role_id: 2,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      };
    }

    const channelRolesRepositoryStub = stubObject<ChannelRolesRepositoryInMemory>(
      channelRolesRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
      }
    );

    storeUserChannelRoleUseCase = new StoreUserChannelRoleUseCase(
      channelRolesRepositoryStub,
      usersRepositoryInMemory
    );

    try {
      await storeUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: channelRole.id,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
