import { beforeUpdate, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

import { BaseModel } from 'App/Shared/Model/BaseModel';
import Channel from './Channel';

export default class Streaming extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public channelId: number;

  @column()
  public video_url: string;

  @column({ serializeAs: null })
  public is_deleted: boolean;

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime;

  @column.dateTime()
  public finished_at: DateTime;

  /**
   * Relationships
   */
  @belongsTo(() => Channel)
  public channel: BelongsTo<typeof Channel>;

  /**
   * Hooks
   */
  @beforeUpdate()
  public static async insertDeletedAt(streaming: Streaming) {
    if (streaming.is_deleted) {
      streaming.deleted_at = DateTime.now();
    }
  }

  @beforeUpdate()
  public static async insertChannelOnline(streaming: Streaming) {
    if (streaming.video_url) {
      streaming.channel.online = true;

      return streaming.channel.save();
    }
  }

  @beforeUpdate()
  public static async removeChannelOnline(streaming: Streaming) {
    if (streaming.finished_at) {
      streaming.channel.online = false;

      return streaming.channel.save();
    }
  }

  /**
   * Scopes
   */
  public static Orsearch = scope((query, search) => {
    const fields = ['title'];
    let sql = '';

    fields.forEach((field, index) => {
      sql += ` ${index !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`;
    });

    return query.orWhereRaw(`(${sql})`);
  });
}
