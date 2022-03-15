import Env from '@ioc:Adonis/Core/Env';
import { PermissionFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = Env.get('APP_URL');

test.group('Admin: Permissions', () => {
  test('it should be able to create a new permission', async (assert) => {
    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    const data = {
      method: 'store',
      resource: 'test_resource',
      description: 'Store test resource',
    };

    const response = await supertest(BASE_URL)
      .post('/admin/permissions')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'id');
    assert.property(response.body, 'method');
    assert.equal(response.body.method, data.method);
    assert.property(response.body, 'resource');
    assert.equal(response.body.resource, data.resource);
    assert.property(response.body, 'description');
    assert.equal(response.body.description, data.description);
  });

  test('it should not be able to create a new permission if already exists', async () => {
    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    const data = {
      method: 'store',
      resource: 'test_resource',
      description: 'Store test resource',
    };

    await PermissionFactory.merge(data).create();

    await supertest(BASE_URL)
      .post('/admin/permissions')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });
});
