import {
  BaseModel as BaseLucidModel,
  beforeFetch,
  beforeFind,
  beforePaginate,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export class BaseModel extends BaseLucidModel {
  /**
   * Columns
   */
  @column({ isPrimary: true })
  public id: string;

  @column()
  public is_deleted: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Hooks
   */
  @beforeFind()
  @beforeFetch()
  public static async ignoreDeleted(query: ModelQueryBuilderContract<any>): Promise<void> {
    query.whereNot('is_deleted', true);
  }

  @beforePaginate()
  public static ignoreDeletedOnPaginate(
    queries: [countQuery: ModelQueryBuilderContract<any>, query: ModelQueryBuilderContract<any>]
  ) {
    queries[0].whereNot('is_deleted', true);
    queries[1].whereNot('is_deleted', true);
  }
}
