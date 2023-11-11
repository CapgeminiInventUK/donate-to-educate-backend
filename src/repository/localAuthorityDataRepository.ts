import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { LocalAuthority } from '../../appsync';

export class LocalAuthorityDataRepository {
  private static instance: LocalAuthorityDataRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<LocalAuthority>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: { username: 'user', password: 'user' },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<LocalAuthority>('LocalAuthorityData');
  }

  static getInstance(): LocalAuthorityDataRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityDataRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<LocalAuthority>): Promise<WithId<LocalAuthority>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  public async list(): Promise<WithId<LocalAuthority>[]> {
    return await this.getByQuery({});
  }
}
