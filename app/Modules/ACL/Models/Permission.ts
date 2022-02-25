import { beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel } from 'App/Shared/Model/BaseModel';
import { DateTime } from 'luxon';

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public method: string;

  @column()
  public resource: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public is_deleted: boolean;

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime;

  @beforeUpdate()
  public static async insertDeletedAt(permission: Permission) {
    if (permission.is_deleted) {
      permission.deleted_at = DateTime.now();
    }
  }
}
