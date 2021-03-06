import Factory from '@ioc:Adonis/Lucid/Factory';
import Channel from 'App/Modules/Channel/Models/Channel';

export const ChannelFactory = Factory.define(Channel, ({ faker }) => {
  return {
    name: faker.random.word(),
    description: faker.random.word(),
  };
}).build();
