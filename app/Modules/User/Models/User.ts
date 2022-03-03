import Hash from '@ioc:Adonis/Core/Hash';
import { beforeSave, column, beforeUpdate, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
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

  @column({ serializeAs: null })
  public password: string;

  @manyToMany(() => Role, { pivotTimestamps: true })
  public roles: ManyToMany<typeof Role>;

  @manyToMany(() => Permission, { pivotTimestamps: true })
  public permissions: ManyToMany<typeof Permission>;

  @column({ serializeAs: null })
  public is_deleted: boolean;

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime;

  @column.dateTime({ serializeAs: null })
  public first_login_at: DateTime;

  @column()
  public avatar: string;

  @column({ serializeAs: null })
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
    user.email = user.email.toLowerCase();
  }

  @beforeUpdate()
  public static async insertDeletedAt(user: User) {
    if (user.is_deleted) {
      user.deleted_at = DateTime.now();
    }
  }
}
