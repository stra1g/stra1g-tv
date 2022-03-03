import Env from '@ioc:Adonis/Core/Env';
import supertest from 'supertest';
import test from 'japa';
import { UserFactory } from 'Database/factories';

const BASE_URL = Env.get('APP_URL');

test.group('Functional: Forgot Password', () => {
  test('it should be able to send a forgot password mail', async (assert) => {
    const user = await UserFactory.create();

    const response = await supertest(BASE_URL).post('/password/forgot').send({
      email: user.email,
    });

    assert.equal(response.status, 200);
  }).timeout(0);
});
