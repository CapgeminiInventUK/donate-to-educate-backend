import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { SignUpData } from '../../appsync';

export class SignUpDataRepository {
  private static instance: SignUpDataRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<SignUpData>;

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
    this.collection = this.db.collection<SignUpData>('SignUps');
  }

  static getInstance(): SignUpDataRepository {
    if (!this.instance) {
      this.instance = new SignUpDataRepository();
    }
    return this.instance;
  }

  private async getOne(query: Filter<SignUpData>): Promise<WithId<SignUpData> | undefined> {
    const result = await this.collection.findOne(query);
    if (!result) {
      return undefined;
    }

    return result;
  }

  public async getById(id: string): Promise<WithId<SignUpData> | undefined> {
    return await this.getOne({ id });
  }

  public async insert(signUpData: SignUpData): Promise<boolean> {
    return (await this.collection.insertOne(signUpData)).acknowledged;
  }
}
