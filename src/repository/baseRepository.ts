import { Collection, Db, Filter, MongoClient, MongoClientOptions, WithId, Document } from 'mongodb';

export abstract class BaseRepository<T extends Document> {
  protected readonly client: MongoClient;
  protected readonly db: Db;
  protected readonly collection: Collection<T>;

  protected constructor(collectionName: string, url: string, options?: MongoClientOptions) {
    this.client = new MongoClient(url, options);
    this.db = this.client.db('D2E');
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
