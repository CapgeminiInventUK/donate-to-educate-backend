import { Collection, Db, MongoClient } from 'mongodb';
import { ItemQuery } from '../../appsync';

export class ItemQueriesRepository {
  private static instance: ItemQueriesRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<ItemQuery>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<ItemQuery>('ItemQueries');
  }

  static getInstance(): ItemQueriesRepository {
    if (!this.instance) {
      this.instance = new ItemQueriesRepository();
    }
    return this.instance;
  }

  public async insert(itemQuery: ItemQuery): Promise<boolean> {
    return (await this.collection.insertOne(itemQuery)).acknowledged;
  }
}
