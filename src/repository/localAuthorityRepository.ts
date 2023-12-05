import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { La } from '../../appsync';

export class LocalAuthorityRepository {
  private static instance: LocalAuthorityRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<La>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: { username: 'user', password: 'user' },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<La>('LocalAuthority');
  }

  static getInstance(): LocalAuthorityRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<La>): Promise<WithId<La>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  public async list(): Promise<WithId<La>[]> {
    return await this.getByQuery({});
  }

  public async insert(la: La): Promise<boolean> {
    return (await this.collection.insertOne(la)).acknowledged;
  }
}
