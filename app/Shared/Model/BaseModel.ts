import {
  BaseModel as BaseLucidModel,
  beforeFetch,
  beforeFind,
  beforePaginate,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm';

export class BaseModel extends BaseLucidModel {
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
