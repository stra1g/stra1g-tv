import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/In-memory/UsersRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { SyncRolesUseCase } from './SyncRolesUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let rolesRepositoryInMemory: RolesRepositoryInMemory;
let syncRolesUseCase: SyncRolesUseCase;

test.group('Sync roles to user', (group) => {
  group.beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    syncRolesUseCase = new SyncRolesUseCase(usersRepositoryInMemory, rolesRepositoryInMemory);
  });

  test('it should be able to sync roles to a specific user', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
      username: 'test',
    });

    const editorRole = await rolesRepositoryInMemory.store({
      name: 'editor',
      description: 'editor',
    });

    const moderatorRole = await rolesRepositoryInMemory.store({
      name: 'moderator',
      description: 'moderator',
    });

    const updatedUser = await syncRolesUseCase.execute({
      userId: user.id,
      roleIds: [editorRole.id, moderatorRole.id],
    });

    assert.property(updatedUser, 'roles');
    assert.lengthOf(updatedUser.roles, 2);
  });

  test('it should not be able to sync roles to a specific user if user does not exists', async (assert) => {
    const editorRole = await rolesRepositoryInMemory.store({
      name: 'editor',
      description: 'editor',
    });

    const moderatorRole = await rolesRepositoryInMemory.store({
      name: 'moderator',
      description: 'moderator',
    });

    try {
      await syncRolesUseCase.execute({
        userId: 6940,
        roleIds: [editorRole.id, moderatorRole.id],
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
