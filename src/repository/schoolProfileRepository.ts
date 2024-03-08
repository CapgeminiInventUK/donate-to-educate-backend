import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { SchoolProfile } from '../../appsync';

export class SchoolProfileRepository {
  private static instance: SchoolProfileRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<SchoolProfile>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<SchoolProfile>('SchoolProfile');
  }

  static getInstance(): SchoolProfileRepository {
    if (!this.instance) {
      this.instance = new SchoolProfileRepository();
    }
    return this.instance;
  }

  private async getOne(query: Filter<SchoolProfile>): Promise<WithId<SchoolProfile> | undefined> {
    const result = await this.collection.findOne(query);

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async getByName(name: string, id: string): Promise<WithId<SchoolProfile> | undefined> {
    return await this.getOne({ name, id });
  }

  public async updateKey(
    id: string,
    name: string,
    key: string,
    value: string,
    localAuthority: string
  ): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { name, id },
        {
          $set: { [key]: JSON.parse(value) as string },
          $setOnInsert: { name, id, localAuthority },
        },
        { upsert: true }
      )
    ).acknowledged;
  }
}
