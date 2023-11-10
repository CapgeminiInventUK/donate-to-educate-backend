import { Collection, Db, MongoClient, WithId } from 'mongodb';
import { School } from '../../appsync';

export class SchoolDataRepository {
  private static instance: SchoolDataRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<School>;

  private constructor() {
    this.client = new MongoClient(process.env.mongoUrl ?? '');
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<School>('SchoolData');
  }

  static getInstance(): SchoolDataRepository {
    if (!this.instance) {
      this.instance = new SchoolDataRepository();
    }
    return this.instance;
  }

  public async list(): Promise<WithId<School>[]> {
    const cursor = this.collection.find();

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }
}
