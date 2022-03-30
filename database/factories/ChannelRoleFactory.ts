import Factory from '@ioc:Adonis/Lucid/Factory';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';

export const ChannelRoleFactory = Factory.define(ChannelRole, ({ faker }) => {
  return {
    role: faker.datatype.string(),
    description: faker.datatype.string(),
  };
}).build();
