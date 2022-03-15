import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import test from 'japa';
import { IndexRolesUseCase } from './IndexRolesUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let indexRolesUseCase: IndexRolesUseCase;

test.group('Index Roles', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    indexRolesUseCase = new IndexRolesUseCase(rolesRepositoryInMemory);
  });

  test('it should be able to index roles', async (assert) => {
    await rolesRepositoryInMemory.store({
      name: 'role_test_one',
      description: 'test_description',
    });
    await rolesRepositoryInMemory.store({
      name: 'role_test_two',
      description: 'test_description',
    });
    await rolesRepositoryInMemory.store({
      name: 'role_test_three',
      description: 'test_description',
    });
    await rolesRepositoryInMemory.store({
      name: 'role_test_four',
      description: 'test_description',
    });

    const page = 1;
    const perPage = 2;

    const roles = await indexRolesUseCase.execute(page, perPage);

    assert.property(roles, 'meta');
    assert.property(roles, 'data');
  });
});
