import Env from '@ioc:Adonis/Core/Env';
import test from 'japa';
import supertest from 'supertest';

import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import { UserFactory } from 'Database/factories';

const BASE_URL = Env.get('APP_URL');

test.group('User: Channel', () => {
  test('it should be able to create a new channel', async (assert) => {
    const user = await UserFactory.merge({ password: '123456' }).create();

    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })
      .expect(200);

    const data: IChannel.DTO.Store = {
      title: 'channel_title',
      description: 'channel_description',
      user_id: user.id,
    };

    const response = await supertest(BASE_URL)
      .post('/channels')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'id');
    assert.property(response.body, 'title');
    assert.property(response.body, 'description');
    assert.property(response.body, 'user_id');
  });

  test('it should not be able to create a new channel if user already has a channel', async () => {
    const user = await UserFactory.merge({ password: '123456' }).create();

    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })
      .expect(200);

    const data: IChannel.DTO.Store = {
      title: 'channel_title',
      description: 'channel_description',
      user_id: user.id,
    };

    await supertest(BASE_URL)
      .post('/channels')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await supertest(BASE_URL)
      .post('/channels')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });
});
