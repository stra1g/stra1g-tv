import Env from '@ioc:Adonis/Core/Env';
import { RoleFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = Env.get('APP_URL');

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
});
