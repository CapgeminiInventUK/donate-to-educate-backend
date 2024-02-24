import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { CharityUser } from '../../appsync';

export class CharityUserRepository {
  private static instance: CharityUserRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<CharityUser>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: {
          username: process?.env?.MONGODB_ADMIN_USERNAME,
          password: process?.env?.MONGODB_ADMIN_PASSWORD,
        },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<CharityUser>('CharityUser');
  }

  static getInstance(): CharityUserRepository {
    if (!this.instance) {
      this.instance = new CharityUserRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<CharityUser>): Promise<WithId<CharityUser>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  private async getOne(query: Filter<CharityUser>): Promise<WithId<CharityUser> | undefined> {
    const result = await this.collection.findOne(query);

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async getByEmail(email: string): Promise<WithId<CharityUser> | undefined> {
    return await this.getOne({ email });
  }

  public async list(): Promise<WithId<CharityUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(charity: CharityUser): Promise<boolean> {
    return (await this.collection.insertOne(charity)).acknowledged;
  }
}
