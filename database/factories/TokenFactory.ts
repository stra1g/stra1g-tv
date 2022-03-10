import Factory from '@ioc:Adonis/Lucid/Factory';
import Token from 'App/Modules/User/Models/Token';
import { DateTime } from 'luxon';

export const TokenFactory = Factory.define(Token, ({ faker }) => {
  return {
    name: faker.name.title(),
    type: faker.random.word(),
    token: faker.random.alpha({ count: 30 }),
    expires_at: DateTime.now().plus({ minutes: 10 }),
  };
}).build();
