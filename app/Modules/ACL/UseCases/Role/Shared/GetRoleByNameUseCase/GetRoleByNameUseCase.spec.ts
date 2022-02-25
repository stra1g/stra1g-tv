import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import test from 'japa';
import { GetRoleByNameUseCase } from './GetRoleByNameUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let getRoleByNameUseCase: GetRoleByNameUseCase;

test.group('Get role by name', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    getRoleByNameUseCase = new GetRoleByNameUseCase(rolesRepositoryInMemory);
  });

  test('it should be able to get a role by name', async (assert) => {
    await rolesRepositoryInMemory.store({
      name: 'test_role',
      description: 'test description',
    });

    const foundRole = await getRoleByNameUseCase.execute('test_role');

    assert.property(foundRole, 'id');
  });
});
