import { column } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel } from 'App/Shared/Model/BaseModel';
import { DateTime } from 'luxon';

export class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public is_deleted: boolean;

  @column.dateTime()
  public deleted_at: DateTime;

  @column.dateTime()
  public first_login_at: DateTime;

  @column()
  public avatar: string;

  @column()
  public language: string;

  @column()
  public online: boolean;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime;
}
