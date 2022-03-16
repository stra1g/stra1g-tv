import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/InMemory/RolesRepositoryInMemory';
import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { CreateRoleUseCase } from './CreateRoleUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let createRoleUseCase: CreateRoleUseCase;

test.group('Create role', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    createRoleUseCase = new CreateRoleUseCase(rolesRepositoryInMemory);
  });

  test('it should be able to create a new role', async (assert) => {
    const data = {
      name: 'admin',
      description: 'Admin role',
    };

    const role = await createRoleUseCase.execute(data);

    assert.property(role, 'id');
  });

  test('it should not be able to create a role with same name', async (assert) => {
    const data = {
      name: 'admin',
      description: 'Admin role',
    };

    await rolesRepositoryInMemory.store(data);

    try {
      await createRoleUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
