import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { SchoolUser } from '../../appsync';

export class SchoolUserRepository {
  private static instance: SchoolUserRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<SchoolUser>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<SchoolUser>('SchoolUser');
  }

  static getInstance(): SchoolUserRepository {
    if (!this.instance) {
      this.instance = new SchoolUserRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<SchoolUser>): Promise<WithId<SchoolUser>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  private async getOne(query: Filter<SchoolUser>): Promise<WithId<SchoolUser> | undefined> {
    const result = await this.collection.findOne(query);

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async getByEmail(email: string): Promise<WithId<SchoolUser> | undefined> {
    return await this.getOne({ email });
  }

  public async list(): Promise<WithId<SchoolUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(school: SchoolUser): Promise<boolean> {
    return (await this.collection.insertOne(school)).acknowledged;
  }
}
