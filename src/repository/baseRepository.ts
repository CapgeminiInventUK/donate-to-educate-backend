import { Collection, Db, Filter, MongoClient, WithId, Document } from 'mongodb';
import { isTest } from '../shared/env';
import { clientOptions } from './config';
import { checkIfDefinedElseDefault } from '../shared/check';

export abstract class BaseRepository<T extends Document> {
  private readonly databaseName = 'D2E';
  protected readonly client: MongoClient;
  protected readonly db: Db;
  protected readonly collection: Collection<T>;

  protected constructor(collectionName: string) {
    this.client = new MongoClient(
      checkIfDefinedElseDefault(process?.env?.MONGO_URL),
      isTest() ? undefined : clientOptions
    );
    this.db = this.client.db(this.databaseName);
    this.collection = this.db.collection<T>(collectionName);
  }

  public async close(): Promise<void> {
    await this.client.close();
  }

  protected async getByQuery(
    query: Filter<T>,
    projectedFields?: Record<string, number>
  ): Promise<WithId<T>[]> {
    const cursor = projectedFields
      ? this.collection.find(query).project<WithId<T>>(projectedFields)
      : this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  protected async getOne(query: Filter<T>): Promise<WithId<T> | undefined> {
    const result = await this.collection.findOne(query);
    if (!result) {
      return undefined;
    }

    return result;
  }

  protected async getCount(query: Filter<T>): Promise<number> {
    return await this.collection.countDocuments(query);
  }
}
