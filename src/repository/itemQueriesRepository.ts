import { ItemQuery } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class ItemQueriesRepository extends BaseRepository<ItemQuery> {
  private static instance: ItemQueriesRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): ItemQueriesRepository {
    if (!this.instance) {
      this.instance = new ItemQueriesRepository(
        'ItemQueries',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async insert(itemQuery: ItemQuery): Promise<boolean> {
    return (await this.collection.insertOne(itemQuery)).acknowledged;
  }
}
