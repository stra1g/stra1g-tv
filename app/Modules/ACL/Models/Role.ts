import { beforeUpdate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel } from 'App/Shared/Model/BaseModel';
import { DateTime } from 'luxon';
import Permission from './Permission';

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @manyToMany(() => Permission, { pivotTimestamps: true })
  public permissions: ManyToMany<typeof Permission>;

  @column({ serializeAs: null })
  public is_deleted: boolean;

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime;

  @beforeUpdate()
  public static async insertDeletedAt(role: Role) {
    if (role.is_deleted) {
      role.deleted_at = DateTime.now();
    }
  }
}
