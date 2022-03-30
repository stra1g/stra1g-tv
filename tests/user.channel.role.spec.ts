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
});
