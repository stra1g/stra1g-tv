import { PermissionsRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/PermissionsRepositoryInMemory';
import test from 'japa';
import { IndexPermissionsUseCase } from './IndexPermissionsUseCase';

let permissionsRepositoryInMemory: PermissionsRepositoryInMemory;
let indexPermissionsUseCase: IndexPermissionsUseCase;

test.group('Index permissions', (group) => {
  group.beforeEach(() => {
    permissionsRepositoryInMemory = new PermissionsRepositoryInMemory();
    indexPermissionsUseCase = new IndexPermissionsUseCase(permissionsRepositoryInMemory);
  });

  test('it should be able to index permissions', async (assert) => {
    await permissionsRepositoryInMemory.store({
      method: 'store',
      resource: 'test_resource',
      description: 'test',
    });
    await permissionsRepositoryInMemory.store({
      method: 'destroy',
      resource: 'test_resource',
      description: 'test',
    });
    await permissionsRepositoryInMemory.store({
      method: 'update',
      resource: 'test_resource',
      description: 'test',
    });
    await permissionsRepositoryInMemory.store({
      method: 'destroy',
      resource: 'test_resource',
      description: 'test',
    });

    const page = 1;
    const perPage = 2;

    const permissions = await indexPermissionsUseCase.execute(page, perPage);

    assert.property(permissions, 'meta');
    assert.property(permissions, 'data');
  });
});
