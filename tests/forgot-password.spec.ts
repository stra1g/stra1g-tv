import crypto from 'crypto';
import Env from '@ioc:Adonis/Core/Env';
import supertest from 'supertest';
import test from 'japa';
import { TokenFactory, UserFactory } from 'Database/factories';
import { DateTime } from 'luxon';

const BASE_URL = Env.get('APP_URL');

test.group('Functional: Forgot Password', () => {
  test('it should be able to send a forgot password mail', async (assert) => {
    const user = await UserFactory.create();

    const response = await supertest(BASE_URL).post('/password/forgot').send({
      email: user.email,
    });

    assert.equal(response.status, 200);
  }).timeout(0);

  test('it should be able to reset password of a user', async (assert) => {
    const user = await UserFactory.create();

    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: 'random_password',
    });

    assert.equal(responseLogin.status, 404);

    const stringToken = crypto.randomBytes(32).toString('hex');

    const forgotPasswordToken = await TokenFactory.merge({
      user_id: user.id,
      type: 'forgot_password',
      token: stringToken,
    }).create();

    const responseReset = await supertest(BASE_URL)
      .post(`/password/reset?token=${forgotPasswordToken.token}`)
      .send({
        password: '654321',
      });

    assert.equal(responseReset.status, 200);

    const newResponseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '654321',
    });

    assert.equal(newResponseLogin.status, 200);
  });

  test('it should not be able to reset password of a user if token is expired', async (assert) => {
    const user = await UserFactory.create();

    const stringToken = crypto.randomBytes(32).toString('hex');

    const forgotPasswordToken = await TokenFactory.merge({
      user_id: user.id,
      type: 'forgot_password',
      token: stringToken,
      expires_at: DateTime.now().minus({ minutes: 10 }),
    }).create();

    const responseReset = await supertest(BASE_URL)
      .post(`/password/reset?token=${forgotPasswordToken.token}`)
      .send({
        password: '654321',
      });

    assert.equal(responseReset.status, 401);
  });
});
