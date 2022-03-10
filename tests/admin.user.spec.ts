import Env from '@ioc:Adonis/Core/Env';
import test from 'japa';
import supertest from 'supertest';

import { PermissionFactory, UserFactory } from 'Database/factories';

const BASE_URL = Env.get('APP_URL');

test.group('Admin: User', () => {
  test('it should be able to sync permissions to a user', async (assert) => {
    const commonUser = await UserFactory.create();

    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    const permissionIds = (await PermissionFactory.createMany(2)).map(
      (permission) => permission.id
    );

    const response = await supertest(BASE_URL)
      .put(`/admin/users/${commonUser.id}/sync/permissions`)
      .send({
        permission_ids: permissionIds,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    console.log(response.body);
    assert.property(response.body, 'permissions');
    assert.isArray(response.body.permissions);
    assert.lengthOf(response.body.permissions, 2);
  });

  test('it should not be able to sync permissions to a user if user does not exists', async () => {
    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    const permissionIds = (await PermissionFactory.createMany(2)).map(
      (permission) => permission.id
    );

    await supertest(BASE_URL)
      .put(`/admin/users/923/sync/permissions`)
      .send({
        permission_ids: permissionIds,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
