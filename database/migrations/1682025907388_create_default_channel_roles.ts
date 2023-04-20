import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';

export default class extends BaseSchema {
  protected tableName = 'create_default_channel_roles';

  public async up() {
    for (const item of ChannelRole.availableRoles) {
      await ChannelRole.create({
        role: item,
        description: item,
      });
    }
  }

  public async down() {}
}
