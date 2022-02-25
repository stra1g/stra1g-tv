import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { PermissionsRepositoryInMemory } from '../../../Repositories/in-memory/PermissionsRepositoryInMemory';
import { CreatePermissionUseCase } from './CreatePermissionUseCase';

let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let createPermissionUseCase: CreatePermissionUseCase;

test.group('Create permission', (group) => {
  group.beforeEach(() => {
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    createPermissionUseCase = new CreatePermissionUseCase(permissionsRepositoryInMemory);
  });

  test('it should be able to create a new permission', async (assert) => {
    const permissionData = {
      method: 'store',
      resource: 'test',
      description: 'Permission test',
    };

    const permission = await createPermissionUseCase.execute(permissionData);

    assert.property(permission, 'id');
  });

  test('it should not be able to create a new permission with same name', async (assert) => {
    const permissionData = {
      method: 'store',
      resource: 'test',
      description: 'Permission test',
    };

    await permissionsRepositoryInMemory.store(permissionData);

    try {
      await createPermissionUseCase.execute(permissionData);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
