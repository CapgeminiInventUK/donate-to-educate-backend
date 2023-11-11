import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { School } from '../../appsync';

export class SchoolDataRepository {
  private static instance: SchoolDataRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<School>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: { username: 'user', password: 'user' },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<School>('SchoolData');
  }

  static getInstance(): SchoolDataRepository {
    if (!this.instance) {
      this.instance = new SchoolDataRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<School>): Promise<WithId<School>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  public async list(): Promise<WithId<School>[]> {
    return await this.getByQuery({});
  }

  public async getByLa(localAuthority: string): Promise<WithId<School>[]> {
    return await this.getByQuery({ localAuthority });
  }
}
