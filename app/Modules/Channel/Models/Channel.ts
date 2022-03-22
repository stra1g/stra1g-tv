import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
  scope,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Modules/User/Models/User';
import ChannelRole from './ChannelRole';
//import { BaseModel } from 'App/Shared/Model/BaseModel';

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ serializeAs: null })
  public userId: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public online: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  /**
   * Relationships
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @manyToMany(() => ChannelRole, {
    pivotTable: 'user_channel_roles',
  })
  public channelRoles: ManyToMany<typeof ChannelRole>;

  /**
   * Hooks
   */
  @beforeFind()
  @beforeFetch()
  public static async ignoreBanned(query: ModelQueryBuilderContract<any>) {
    query.whereNot({ banned: true });
  }

  @afterCreate()
  public static async attachOwnerRole(channel: Channel) {
    const ownerRole = await ChannelRole.findBy('role', 'owner');

    if (ownerRole) {
      await channel.related('channelRoles').attach({
        [ownerRole.id]: {
          user_id: channel.userId,
        },
      });
    }
  }

  /**
   * Scopes
   */
  public static search = scope((query, search) => {
    const fields = ['name'];
    let sql = '';

    fields.forEach((field, index) => {
      sql += ` ${index !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`;
    });

    return query.whereRaw(`(${sql})`);
  });
}
