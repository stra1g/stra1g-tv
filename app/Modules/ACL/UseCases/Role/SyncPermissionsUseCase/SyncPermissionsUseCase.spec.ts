import { PermissionsRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/PermissionsRepositoryInMemory';
import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { SyncPermissionsUseCase } from './SyncPermissionsUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let syncPermissionsUseCase: SyncPermissionsUseCase;

test.group('Sync permissions to role', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    syncPermissionsUseCase = new SyncPermissionsUseCase(
      rolesRepositoryInMemory,
      permissionsRepositoryInMemory
    );
  });

  test('it should be able to sync permissions to a specific role', async (assert) => {
    const role = await rolesRepositoryInMemory.store({ name: 'test_role', description: 'Test' });

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

    const updatedRole = await syncPermissionsUseCase.execute({
      role_id: role.id,
      permissionIds: [storePermission.id, destroyPermission.id],
    });

    assert.property(updatedRole, 'permissions');
    assert.lengthOf(updatedRole.permissions, 2);
  });

  test('it should not be able to sync permissions to a role if role does not exists', async (assert) => {
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
      await syncPermissionsUseCase.execute({
        role_id: 843824,
        permissionIds: [storePermission.id, destroyPermission.id],
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
