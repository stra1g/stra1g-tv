import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import test from 'japa';
import { UsersRepositoryInMemory } from '../../../Repositories/In-memory/UsersRepositoryInMemory';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let showUserProfileUseCase: ShowUserProfileUseCase;

test.group('Show user profile', (group) => {
  group.beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  test('it should be able to show the user profile', async (assert) => {
    const user = await usersRepositoryInMemory.store({
      email: 'admin@test.com',
      name: 'test',
      password: '123456',
      username: 'test',
    });

    const foundUser = await showUserProfileUseCase.execute(user.id);

    assert.property(foundUser, 'id');
  });

  test('it should not be able to show the user profile if user does not exists', async (assert) => {
    try {
      await showUserProfileUseCase.execute(923);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
    }
  });
});
