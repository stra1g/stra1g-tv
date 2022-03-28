import test from 'japa';
import { DateTime } from 'luxon';
import I18n, { I18nContract } from '@ioc:Adonis/Addons/I18n';
import { stubObject } from 'ts-sinon';

import { UpdateUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/UpdateUserChannelRoleUseCase/UpdateUserChannelRoleUseCase';
import { ChannelRolesRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelRolesRepositoryInMemory';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/UsersRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import AppException from 'App/Shared/Exceptions/AppException';

let channelRoleRepositoryInMemory: ChannelRolesRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserChannelRoleUseCase: UpdateUserChannelRoleUseCase;
let i18n: I18nContract;

test.group('Unit: Update user channel role', async (group) => {
  group.beforeEach(() => {
    channelRoleRepositoryInMemory = new ChannelRolesRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    i18n = I18n.locale('pt-br');
  });

  test('it should not be able to update a user channel role if user does not exists', async (assert) => {
    updateUserChannelRoleUseCase = new UpdateUserChannelRoleUseCase(
      channelRoleRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await updateUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: 2,
        userId: 1,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
      assert.equal(
        error.message,
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }
  });

  test('it should not be able to update a user channel role if userChannelRole does not exists', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'test name',
      password: '123456',
      username: 'tester',
    });

    async function findUserChannelRole() {
      return null;
    }

    const channelRoleRepositoryStubbed = stubObject<ChannelRolesRepositoryInMemory>(
      channelRoleRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
      }
    );

    updateUserChannelRoleUseCase = new UpdateUserChannelRoleUseCase(
      channelRoleRepositoryStubbed,
      usersRepositoryInMemory
    );

    try {
      await updateUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: 2,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
      assert.equal(
        error.message,
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user_channel_role'),
        })
      );
    }
  });

  test('it should not be able to update a user channel role if channelRole does not exists', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'test name',
      password: '123456',
      username: 'tester',
    });

    async function findUserChannelRole(): Promise<IChannelRole.UserChannelRole | null> {
      return {
        id: 1,
        user_id: user.id,
        channel_id: 1,
        channel_role_id: 2,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      };
    }

    const channelRoleRepositoryStubbed = stubObject<ChannelRolesRepositoryInMemory>(
      channelRoleRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
      }
    );

    updateUserChannelRoleUseCase = new UpdateUserChannelRoleUseCase(
      channelRoleRepositoryStubbed,
      usersRepositoryInMemory
    );

    try {
      await updateUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: 2,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
      assert.equal(
        error.message,
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channel_role'),
        })
      );
    }
  });

  test('it should not be able to update a user channel role if new channelRole is owner', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'test name',
      password: '123456',
      username: 'tester',
    });

    const channelRole = await channelRoleRepositoryInMemory.store({
      description: 'owner role',
      role: 'owner',
    });

    async function findUserChannelRole(): Promise<IChannelRole.UserChannelRole | null> {
      return {
        id: 1,
        user_id: user.id,
        channel_id: 1,
        channel_role_id: 2,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      };
    }

    const channelRoleRepositoryStubbed = stubObject<ChannelRolesRepositoryInMemory>(
      channelRoleRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
      }
    );

    updateUserChannelRoleUseCase = new UpdateUserChannelRoleUseCase(
      channelRoleRepositoryStubbed,
      usersRepositoryInMemory
    );

    try {
      await updateUserChannelRoleUseCase.execute({
        channelId: 1,
        channelRoleId: channelRole.id,
        userId: user.id,
      });
    } catch (error) {
      assert.instanceOf(error, AppException);
      assert.equal(error.message, i18n.formatMessage('messages.errors.duplicated_channel_owner'));
    }
  });

  test('it should be able to update a user channel role', async () => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'test name',
      password: '123456',
      username: 'tester',
    });

    const channelRole = await channelRoleRepositoryInMemory.store({
      description: 'test channel role',
      role: 'test_channel_role',
    });

    async function findUserChannelRole(): Promise<IChannelRole.UserChannelRole | null> {
      return {
        id: 1,
        user_id: user.id,
        channel_id: 1,
        channel_role_id: 2,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      };
    }

    const channelRoleRepositoryStubbed = stubObject<ChannelRolesRepositoryInMemory>(
      channelRoleRepositoryInMemory,
      {
        findUserChannelRole: findUserChannelRole(),
        updateUserChannelRole: (async function () {})(),
      }
    );

    updateUserChannelRoleUseCase = new UpdateUserChannelRoleUseCase(
      channelRoleRepositoryStubbed,
      usersRepositoryInMemory
    );

    await updateUserChannelRoleUseCase.execute({
      channelId: 1,
      channelRoleId: channelRole.id,
      userId: user.id,
    });
  });
});
