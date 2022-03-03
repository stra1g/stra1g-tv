import Env from '@ioc:Adonis/Core/Env';
import supertest from 'supertest';
import test from 'japa';
import { UserFactory } from 'Database/factories';

const BASE_URL = Env.get('APP_URL');

test.group('Functional: Session', () => {
  test('it should be able to login a user', async (assert) => {
    const password = '123456';
    const user = await UserFactory.merge({ password }).create();

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password,
    });

    assert.equal(response.status, 200);
    assert.property(response.body, 'access_token');
    assert.property(response.body, 'refresh_token');
  });

  test('it should not be able to login a user if user does not exists', async (assert) => {
    const response = await supertest(BASE_URL).post('/sessions').send({
      email: 'not.existing@mail.com',
      password: '123',
    });

    assert.equal(response.status, 404);
    assert.property(response.body, 'message');
    assert.property(response.body, 'status');
    assert.property(response.body, 'showable');
    assert.isBoolean(response.body.showable);
    assert.isTrue(response.body.showable);
  });

  test('it should not be able to login a user if password is incorrect', async (assert) => {
    const password = '123456';
    const user = await UserFactory.merge({ password }).create();

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: 'wrong_password',
    });

    assert.equal(response.status, 404);
    assert.property(response.body, 'message');
    assert.property(response.body, 'status');
    assert.property(response.body, 'showable');
    assert.isBoolean(response.body.showable);
    assert.isTrue(response.body.showable);
  });
});
