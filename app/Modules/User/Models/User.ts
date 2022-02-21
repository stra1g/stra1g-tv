import Hash from '@ioc:Adonis/Core/Hash';
import { beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel } from 'App/Shared/Model/BaseModel';
import { DateTime } from 'luxon';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public rememberMeToken?: string;

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

  /**
   * Hooks
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
