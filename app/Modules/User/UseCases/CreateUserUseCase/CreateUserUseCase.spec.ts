import AppException from 'App/Shared/Exceptions/AppException';
import test from 'japa';
import { UsersRepositoryInMemory } from '../../Repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

test.group('Create User', (group) => {
  group.before(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
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
    const data = {
      name: 'Name test',
      email: 'test@test.com',
      username: 'username_test',
      password: '123456',
    };

    try {
      await createUserUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });

  test('it should not be able to create a new user if email already exists', async (assert) => {
    const data = {
      name: 'Name test',
      email: 'email@test.com',
      username: 'testing_username',
      password: '123456',
    };

    try {
      await createUserUseCase.execute(data);
    } catch (error) {
      assert.instanceOf(error, AppException);
    }
  });
});
