import { PermissionsRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/PermissionsRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { UsersRepositoryInMemory } from '../../../Repositories/In-memory/UsersRepositoryInMemory';
import { AttachPermissionsUseCase } from './AttachPermissionsUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let attachPermissionUseCase: AttachPermissionsUseCase;

test.group('Attach permissions to user', (group) => {
  group.beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    attachPermissionUseCase = new AttachPermissionsUseCase(
      usersRepositoryInMemory,
      permissionsRepositoryInMemory
    );
  });

  test('it should be able to attach permissions to a specific user', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
      username: 'test',
    });

    const storePermission = await permissionsRepositoryInMemory.store({
      method: 'store',
      resource: 'test_resource',
      description: 'test',
    });
    const destroyPermission = await permissionsRepositoryInMemory.store({
      method: 'destroy',
      resource: 'test_resource',
      description: 'test',
    });

    const updatedUser = await attachPermissionUseCase.execute({
      user_id: user.id,
      permissionIds: [storePermission.id, destroyPermission.id],
    });

    assert.property(updatedUser, 'permissions');
    assert.lengthOf(updatedUser.permissions, 2);
  });

  test('it should not be able to attach permissions to user if user does not exists', async (assert) => {
    const storePermission = await permissionsRepositoryInMemory.store({
      method: 'store',
      resource: 'test_resource',
      description: 'test',
    });
    const destroyPermission = await permissionsRepositoryInMemory.store({
      method: 'destroy',
      resource: 'test_resource',
      description: 'test',
    });

    try {
      await attachPermissionUseCase.execute({
        user_id: 9999,
        permissionIds: [storePermission.id, destroyPermission.id],
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
