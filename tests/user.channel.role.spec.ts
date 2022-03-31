import I18n, { I18nContract } from '@ioc:Adonis/Addons/I18n';
import { ChannelFactory, ChannelRoleFactory, UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
let i18n: I18nContract;

test.group('Functional: User channel role', (group) => {
  group.beforeEach(() => {
    i18n = I18n.locale('pt-br');
  });

  test('it should be able to store a new user channel role', async (assert) => {
    const user = await UserFactory.merge({ password: '123456' }).create();
    const channel = await ChannelFactory.merge({ userId: user.id }).create();

    const anotherUser = await UserFactory.create();

    const channelRole = await ChannelRoleFactory.create();

    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      })
      .expect(200);

    const data = {
      channel_id: channel.id,
      channel_role_id: channelRole.id,
      user_id: anotherUser.id,
    };

    const response = await supertest(BASE_URL)
      .post('/channels/user/roles')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.equal(
      response.body.message,
      i18n.formatMessage('messages.success.successfully_assigned_role')
    );
  });

  test('it should be able to list all user channel roles', async (assert) => {
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

    const channelRole = await ChannelRoleFactory.create();

    const users = await UserFactory.createMany(3);
    for (const user of users) {
      await channelRole.related('channels').attach({
        [channel.id]: {
          user_id: user.id,
        },
      });
    }

    const page = 1;
    const perPage = 5;

    const response = await supertest(BASE_URL)
      .get(`/channels/${channel.id}/user/roles?page=${page}&per_page=${perPage}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'meta');
    assert.property(response.body.meta, 'total');
    assert.property(response.body.meta, 'per_page');
    assert.property(response.body.meta, 'current_page');
    assert.property(response.body.meta, 'last_page');
    assert.property(response.body.meta, 'first_page');
    assert.property(response.body.meta, 'first_page_url');
    assert.property(response.body.meta, 'last_page_url');
    assert.property(response.body.meta, 'next_page_url');
    assert.property(response.body.meta, 'previous_page_url');
    assert.property(response.body, 'data');
    assert.property(response.body.data[0], 'name');
    assert.property(response.body.data[0], 'username');
    assert.property(response.body.data[0], 'role');
    assert.property(response.body.data[0], 'created_at');
  });

  test('it should be able to update user channel role', async (assert) => {
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

    const channelRole = await ChannelRoleFactory.create();

    const anotherUser = await UserFactory.create();
    await channelRole.related('channels').attach({
      [channel.id]: {
        user_id: anotherUser.id,
      },
    });

    const anotherChannelRole = await ChannelRoleFactory.create();

    const data = {
      channel_id: channel.id,
      channel_role_id: anotherChannelRole.id,
      user_id: anotherUser.id,
    };

    const response = await supertest(BASE_URL)
      .put('/channels/user/roles')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.equal(
      response.body.message,
      i18n.formatMessage('messages.success.successfully_assigned_role')
    );
  });
});
