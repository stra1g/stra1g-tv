import { PermissionsRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/PermissionsRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { UsersRepositoryInMemory } from '../../../Repositories/In-memory/UsersRepositoryInMemory';
import { SyncPermissionsUseCase } from './SyncPermissionsUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let syncPermissionUseCase: SyncPermissionsUseCase;

test.group('Sync permissions to user', (group) => {
  group.beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    syncPermissionUseCase = new SyncPermissionsUseCase(
      usersRepositoryInMemory,
      permissionsRepositoryInMemory
    );
  });

  test('it should be able to sync permissions to a specific user', async (assert) => {
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

    const updatedUser = await syncPermissionUseCase.execute({
      userId: user.id,
      permissionIds: [storePermission.id, destroyPermission.id],
    });

    assert.property(updatedUser, 'permissions');
    assert.lengthOf(updatedUser.permissions, 2);
  });

  test('it should not be able to sync permissions to user if user does not exists', async (assert) => {
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
      await syncPermissionUseCase.execute({
        userId: 9999,
        permissionIds: [storePermission.id, destroyPermission.id],
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
