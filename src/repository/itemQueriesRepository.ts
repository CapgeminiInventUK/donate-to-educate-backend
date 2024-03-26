import { ItemQuery } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class ItemQueriesRepository extends BaseRepository<ItemQuery> {
  private static instance: ItemQueriesRepository;

  static getInstance(): ItemQueriesRepository {
    if (!this.instance) {
      this.instance = new ItemQueriesRepository('ItemQueries');
    }
    return this.instance;
  }

  public async insert(itemQuery: ItemQuery): Promise<boolean> {
    return (await this.collection.insertOne(itemQuery)).acknowledged;
  }
}
