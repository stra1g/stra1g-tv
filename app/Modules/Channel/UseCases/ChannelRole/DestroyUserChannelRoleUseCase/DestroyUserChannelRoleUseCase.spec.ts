import test from 'japa';
import I18n, { I18nContract } from '@ioc:Adonis/Addons/I18n';
import { stubObject } from 'ts-sinon';

import { ChannelRolesRepositoryInMemory } from 'App/Modules/Channel/Repositories/InMemory/ChannelRolesRepositoryInMemory';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/UsersRepositoryInMemory';
import { DestroyUserChannelRoleUseCase } from './DestroyUserChannelRoleUseCase';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

let channelRolesRepositoryInMemory: ChannelRolesRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let destroyUserChannelRoleUseCase: DestroyUserChannelRoleUseCase;
let i18n: I18nContract;

test.group('Unit: Destroy user channel role', (group) => {
  group.beforeEach(() => {
    channelRolesRepositoryInMemory = new ChannelRolesRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    i18n = I18n.locale('pt-br');
  });

  test('it should not be able to destroy user channel role if user does not exists', async (assert) => {
    destroyUserChannelRoleUseCase = new DestroyUserChannelRoleUseCase(
      channelRolesRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await destroyUserChannelRoleUseCase.execute(1, 1);
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

  test('it should be able to destroy user channel role', async () => {
    const user = await usersRepositoryInMemory.store({
      email: 'test@email.com',
      name: 'test name',
      password: '123456',
      username: 'tester',
    });

    const channelRolesRepositoryStubbed = stubObject<ChannelRolesRepositoryInMemory>(
      channelRolesRepositoryInMemory,
      {
        destroyUserChannelRole: (async function () {})(),
      }
    );

    destroyUserChannelRoleUseCase = new DestroyUserChannelRoleUseCase(
      channelRolesRepositoryStubbed,
      usersRepositoryInMemory
    );

    await destroyUserChannelRoleUseCase.execute(user.id, 1);
  });
});
