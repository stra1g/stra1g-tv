import Factory from '@ioc:Adonis/Lucid/Factory';
import Role from 'App/Modules/ACL/Models/Role';

export const RoleFactory = Factory.define(Role, ({ faker }) => {
  return {
    name: faker.random.word(),
    description: faker.random.word(),
  };
}).build();
