import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { LocalAuthorityUser } from '../../appsync';
export class LocalAuthorityUserRepository {
  private static instance: LocalAuthorityUserRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<LocalAuthorityUser>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: { username: 'user', password: 'user' },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<LocalAuthorityUser>('LocalAuthority');
  }

  static getInstance(): LocalAuthorityUserRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityUserRepository();
    }
    return this.instance;
  }

  public async getByUser(email: string): Promise<WithId<LocalAuthorityUser> | undefined> {
    return await this.getOne({ email });
  }

  private async getOne(
    query: Filter<LocalAuthorityUser>
  ): Promise<WithId<LocalAuthorityUser> | undefined> {
    const result = await this.collection.findOne(query);
    if (!result) {
      return undefined;
    }

    return result;
  }
}
