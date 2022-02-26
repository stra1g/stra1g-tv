import { RolesRepositoryInMemory } from 'App/Modules/ACL/Repositories/in-memory/RolesRepositoryInMemory';
import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { UsersRepositoryInMemory } from '../../Repositories/In-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

let rolesRepositoryInMemory: RolesRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

test.group('Create User', (group) => {
  group.beforeEach(() => {
    rolesRepositoryInMemory = new RolesRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory, rolesRepositoryInMemory);
  });

  test('it should be able to create a new user', async (assert) => {
    const data = {
      name: 'Name test',
      email: 'email@test.com',
      username: 'username_test',
      password: '123456',
    };

    const user = await createUserUseCase.execute(data);

    assert.property(user, 'id');
  });

  test('it should not be able to create a new user if username already exists', async (assert) => {
    await usersRepositoryInMemory.store({
      name: 'Name test',
      email: 'test@test.com',
      username: 'username_test',
      password: '123456',
    });

    try {
      await createUserUseCase.execute({
        name: 'Name test',
        email: 'test@test.com',
        username: 'test_username',
        password: '123456',
      });
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });

  test('it should not be able to create a new user if email already exists', async (assert) => {
    await usersRepositoryInMemory.store({
      name: 'Name test',
      email: 'test@test.com',
      username: 'username_testing',
      password: '123456',
    });

    const data = {
      name: 'Name test',
      email: 'test@test.com',
      username: 'user_testing',
      password: '123456',
    };

    try {
      await createUserUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
