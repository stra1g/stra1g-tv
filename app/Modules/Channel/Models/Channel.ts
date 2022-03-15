import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm';
//import { BaseModel } from 'App/Shared/Model/BaseModel';

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public online: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @beforeFind()
  @beforeFetch()
  public static async ignoreBanned(query: ModelQueryBuilderContract<any>) {
    query.whereNot({ banned: true });
  }
}
