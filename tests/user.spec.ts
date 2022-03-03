import Env from '@ioc:Adonis/Core/Env';
import supertest from 'supertest';
import test from 'japa';

const BASE_URL = Env.get('APP_URL');

test.group('Functional: User', () => {
  test('it should be able to create a new user as common_user', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Test name',
      username: 'test_username',
      email: 'email@test.com',
      password: '123456',
    });

    assert.equal(response.status, 200);
    assert.property(response.body, 'id');
    assert.property(response.body, 'roles');
    assert.isArray(response.body.roles);
    assert.lengthOf(response.body.roles, 1);
    assert.deepInclude(response.body.roles[0], { name: 'common_user' });
  });

  test('it should not be able to create a new user if username already exists', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Test name',
      username: 'test_username',
      email: 'email@anothertest.com',
      password: '123456',
    });

    assert.equal(response.status, 400);
    assert.property(response.body, 'message');
    assert.property(response.body, 'status');
    assert.property(response.body, 'showable');
    assert.isBoolean(response.body.showable);
    assert.isTrue(response.body.showable);
  });

  test('it should not be able to create a new user if email already exists', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Test name',
      username: 'test_another_username',
      email: 'email@test.com',
      password: '123456',
    });

    assert.equal(response.status, 400);
    assert.property(response.body, 'message');
    assert.property(response.body, 'status');
    assert.property(response.body, 'showable');
    assert.isBoolean(response.body.showable);
    assert.isTrue(response.body.showable);
  });
});
