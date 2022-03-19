import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { ChannelFactory, StreamingFactory, UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('User: Streaming', () => {
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
      video_url: 'https://anyurl.com',
    };

    const response = await supertest(BASE_URL)
      .post('/streamings')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    assert.property(response.body, 'id');
    assert.property(response.body, 'channel_id');
    assert.property(response.body, 'description');
    assert.property(response.body, 'title');
    assert.property(response.body, 'video_url');
  });

  test('it should not be able to create a new streaming if channel does not exists', async (assert) => {
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

    const data: IStreaming.DTO.Store = {
      channel_id: 938,
      description: 'streaming description',
      title: 'streaming title',
      video_url: 'https://anyurl.com',
    };

    const response = await supertest(BASE_URL)
      .post('/streamings')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(422);

    assert.property(response.body, 'errors');
    assert.isArray(response.body.errors);
    assert.lengthOf(response.body.errors, 1);
    assert.property(response.body.errors[0], 'rule');
    assert.equal(response.body.errors[0].rule, 'exists');
    assert.property(response.body.errors[0], 'field');
    assert.equal(response.body.errors[0].field, 'channel_id');
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

    await StreamingFactory.merge({ channel_id: channel.id }).create();

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
