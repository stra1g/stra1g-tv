import Factory from '@ioc:Adonis/Lucid/Factory';
import Token from 'App/Modules/User/Models/Token';
import User from 'App/Modules/User/Models/User';
import { DateTime } from 'luxon';

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.firstName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}).build();

export const TokenFactory = Factory.define(Token, ({ faker }) => {
  return {
    name: faker.name.title(),
    type: faker.random.word(),
    token: faker.random.alpha({ count: 30 }),
    expires_at: DateTime.now().plus({ minutes: 10 }),
  };
}).build();
