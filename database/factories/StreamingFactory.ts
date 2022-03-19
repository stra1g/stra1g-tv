import Factory from '@ioc:Adonis/Lucid/Factory';
import Streaming from 'App/Modules/Channel/Models/Streaming';

export const StreamingFactory = Factory.define(Streaming, ({ faker }) => {
  return {
    title: faker.datatype.string(),
    description: faker.datatype.string(),
    channel_id: faker.datatype.number(),
    video_url: faker.internet.url(),
  };
}).build();
