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
        auth: {
          username: process?.env?.MONGODB_ADMIN_USERNAME,
          password: process?.env?.MONGODB_ADMIN_PASSWORD,
        },
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

  public async getByUser(email: string): Promise<LocalAuthorityUser> {
    return (await this.getByQuery({ email })).at(0)!;
  }

  private async getByQuery(
    query: Filter<LocalAuthorityUser>
  ): Promise<WithId<LocalAuthorityUser>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }
}
