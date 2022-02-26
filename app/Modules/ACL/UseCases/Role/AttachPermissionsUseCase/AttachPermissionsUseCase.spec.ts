import { PermissionsRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/PermissionsRepositoryInMemory';
import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { AttachPermissionsUseCase } from './AttachPermissionsUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let attachPermissionsUseCase: AttachPermissionsUseCase;

test.group('Attach permissions to role', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    attachPermissionsUseCase = new AttachPermissionsUseCase(
      rolesRepositoryInMemory,
      permissionsRepositoryInMemory
    );
  });

  test('it should be able to attach permissions to a specific role', async (assert) => {
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

    const updatedRole = await attachPermissionsUseCase.execute({
      role_id: role.id,
      permissionIds: [storePermission.id, destroyPermission.id],
    });

    assert.property(updatedRole, 'permissions');
    assert.lengthOf(updatedRole.permissions, 2);
  });

  test('it should not be able to attach permissions to a role if role does not exists', async (assert) => {
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
      await attachPermissionsUseCase.execute({
        role_id: 843824,
        permissionIds: [storePermission.id, destroyPermission.id],
      });
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
