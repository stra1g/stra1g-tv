import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Modules/User/Models/User';
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

  /**
   * Hooks
   */
  @beforeFind()
  @beforeFetch()
  public static async ignoreBanned(query: ModelQueryBuilderContract<any>) {
    query.whereNot({ banned: true });
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
