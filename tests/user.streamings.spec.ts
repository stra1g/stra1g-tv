import I18n, { I18nContract } from '@ioc:Adonis/Addons/I18n';
import test from 'japa';
import supertest from 'supertest';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { ChannelFactory, StreamingFactory, UserFactory } from 'Database/factories';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

let i18n: I18nContract;

test.group('User: Streaming', (group) => {
  group.beforeEach(() => {
    i18n = I18n.locale('pt-br');
  });

  test('it should be able to create a new streaming', async (assert) => {
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

    const channel = await ChannelFactory.merge({ userId: user.id }).create();

    const data: IStreaming.DTO.Store = {
      channel_id: channel.id,
      description: 'streaming description',
      title: 'streaming title',
    };

    const response = await supertest(BASE_URL)
      .post('/streamings')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    assert.property(response.body, 'streaming');
    assert.property(response.body.streaming, 'description');
    assert.property(response.body.streaming, 'title');
    assert.property(response.body.streaming, 'created_at');
    assert.property(response.body, 'url');
    assert.isString(response.body.url);
  });

  test('it should not be able to create a new streaming with another one online to same channel', async () => {
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

    const channel = await ChannelFactory.merge({ userId: user.id }).create();

    await StreamingFactory.merge({ channelId: channel.id }).create();

    const data: IStreaming.DTO.Store = {
      channel_id: channel.id,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    };

    await supertest(BASE_URL)
      .post('/streamings')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });
});
