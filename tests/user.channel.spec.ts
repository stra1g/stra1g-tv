import test from 'japa';
import supertest from 'supertest';

import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import { ChannelFactory, UserFactory } from 'Database/factories';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

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
      name: 'channel_name',
      description: 'channel_description',
      user_id: user.id,
    };

    const response = await supertest(BASE_URL)
      .post('/channels')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'id');
    assert.property(response.body, 'name');
    assert.property(response.body, 'description');
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
      name: 'channel_name',
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

  test('it should be able to show a channel', async (assert) => {
    const user = await UserFactory.merge({ password: '123456' }).create();

    const channel = await ChannelFactory.merge({ userId: user.id }).create();

    const response = await supertest(BASE_URL).get(`/channels/${channel.id}`).expect(200);

    assert.property(response.body, 'id');
    assert.property(response.body, 'name');
    assert.property(response.body, 'description');
    assert.property(response.body, 'user');
  });

  test('it should not be able to show a channel if does not exists', async () => {
    await supertest(BASE_URL).get(`/channels/2398`).expect(404);
  });

  test('it should be able to update a channel', async (assert) => {
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

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    const channel = await ChannelFactory.merge({ userId: user.id }).create();

    const response = await supertest(BASE_URL)
      .put(`/channels/${channel.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(200);

    assert.equal(response.body.description, data.description);
    assert.equal(response.body.name, data.name);
  });

  test('it should not be able to update a channel if channel does not exists', async () => {
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

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    await supertest(BASE_URL)
      .put(`/channels/8439`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(404);
  });

  test('it should not be able to update a channel if user does not have access to channel', async () => {
    const user = await UserFactory.merge({ password: '123456' }).create();
    const anotherUser = await UserFactory.merge({ password: '123456' }).create();

    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })
      .expect(200);

    const channel = await ChannelFactory.merge({ userId: anotherUser.id }).create();

    const data: IChannel.DTO.Update = {
      description: 'changed test description',
      name: 'changed test name',
    };

    await supertest(BASE_URL)
      .put(`/channels/${channel.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(404);
  });
});
