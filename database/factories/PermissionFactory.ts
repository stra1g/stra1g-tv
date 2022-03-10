import Factory from '@ioc:Adonis/Lucid/Factory';
import Permission from 'App/Modules/ACL/Models/Permission';

export const PermissionFactory = Factory.define(Permission, ({ faker }) => {
  return {
    method: faker.random.arrayElement(['store', 'update', 'destroy', 'index', 'show']),
    resource: faker.random.word(),
    description: faker.random.alpha({ count: 10 }),
  };
}).build();
