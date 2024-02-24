import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { CharityProfile } from '../../appsync';

export class CharityProfileRepository {
  private static instance: CharityProfileRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<CharityProfile>;

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
    this.collection = this.db.collection<CharityProfile>('CharityProfile');
  }

  static getInstance(): CharityProfileRepository {
    if (!this.instance) {
      this.instance = new CharityProfileRepository();
    }
    return this.instance;
  }

  private async getOne(query: Filter<CharityProfile>): Promise<WithId<CharityProfile> | undefined> {
    const result = await this.collection.findOne(query);

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async getByName(name: string): Promise<WithId<CharityProfile> | undefined> {
    return await this.getOne({ name });
  }
}
