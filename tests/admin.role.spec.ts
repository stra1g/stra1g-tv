import { PermissionFactory, RoleFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Admin: Role', () => {
  test('it should be able to create a new role', async (assert) => {
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
      name: 'test_role',
      description: 'test_description',
    };

    const response = await supertest(BASE_URL)
      .post('/admin/roles')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'id');
    assert.property(response.body, 'name');
    assert.equal(response.body.name, data.name);
    assert.property(response.body, 'description');
    assert.equal(response.body.description, data.description);
  });

  test('it should not be able to create a new role if name already exists', async () => {
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
      name: 'test_role',
      description: 'test_description',
    };

    await RoleFactory.merge(data).create();

    await supertest(BASE_URL)
      .post('/admin/roles')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });

  test('it should be able to sync permissions to a role', async (assert) => {
    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    const role = await RoleFactory.create();

    const permissionIds = (await PermissionFactory.createMany(2)).map(
      (permission) => permission.id
    );

    const response = await supertest(BASE_URL)
      .put(`/admin/roles/${role.id}/sync/permissions`)
      .send({
        permission_ids: permissionIds,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'permissions');
    assert.isArray(response.body.permissions);
    assert.lengthOf(response.body.permissions, 2);
  });

  test('it should not be able to sync permissions to a role if role does not exists', async () => {
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
      .put(`/admin/roles/739/sync/permissions`)
      .send({
        permission_ids: permissionIds,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  test('it should be able to list roles', async (assert) => {
    const {
      body: { access_token: accessToken },
    } = await supertest(BASE_URL)
      .post('/sessions')
      .send({
        email: 'admin@stra1g.com',
        password: 'admin',
      })
      .expect(200);

    await RoleFactory.createMany(5);

    const response = await supertest(BASE_URL)
      .get('/admin/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    assert.property(response.body, 'meta');
    assert.property(response.body, 'data');
    assert.property(response.body.data[0], 'id');
    assert.property(response.body.data[0], 'name');
    assert.property(response.body.data[0], 'description');
  });
});
