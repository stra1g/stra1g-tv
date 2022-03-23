import { column, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

import User from 'App/Modules/User/Models/User';
import Channel from './Channel';

export default class ChannelRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public role: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime;

  public static availableRoles = ['owner', 'moderator', 'vip'];

  /**
   * Relationships
   */
  @manyToMany(() => User, {
    pivotTable: 'user_channel_roles',
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Channel, {
    pivotTable: 'user_channel_roles',
  })
  public channels: ManyToMany<typeof Channel>;

  /**
   * Hooks
   */
}
