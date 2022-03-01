import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm';

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public token: string;

  @column()
  public is_revoked: boolean;

  @column.dateTime({ autoCreate: true })
  public expires_at: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeFind()
  @beforeFetch()
  public static async ignoreRevoked(query: ModelQueryBuilderContract<any>) {
    query.whereNot({ is_revoked: true }).orWhereNot('is_revoked', DateTime.now().toISO());
  }
}
