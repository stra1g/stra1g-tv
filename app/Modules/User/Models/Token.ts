import Env from '@ioc:Adonis/Core/Env';

import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import { Encryption } from '@adonisjs/core/build/standalone';

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

  @beforeSave()
  public static async encryptToken(token: Token) {
    const encryption = new Encryption({ secret: Env.get('REFRESH_TOKEN_ENCRYPT_KEY') });

    if (token.$dirty.token) {
      token.token = encryption.encrypt(token);
    }
  }
}
