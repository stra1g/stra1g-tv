import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';

export default class ChannelRoleSeeder extends BaseSeeder {
  public async run() {
    await ChannelRole.createMany([
      {
        role: 'owner',
        description: 'The owner of channel',
      },
    ]);
  }
}
