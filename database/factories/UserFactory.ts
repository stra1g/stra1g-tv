import Factory from '@ioc:Adonis/Lucid/Factory';
import User from 'App/Modules/User/Models/User';

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.firstName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}).build();
