import { Collection, Db, MongoClient } from 'mongodb';
import { LocalAuthorityRegisterRequest } from '../../appsync';

export class LocalAuthorityRegisterRequestsRepository {
  private static instance: LocalAuthorityRegisterRequestsRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<LocalAuthorityRegisterRequest>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<LocalAuthorityRegisterRequest>(
      'LocalAuthorityRegisterRequests'
    );
  }

  static getInstance(): LocalAuthorityRegisterRequestsRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityRegisterRequestsRepository();
    }
    return this.instance;
  }

  public async insert(registerRequestData: LocalAuthorityRegisterRequest): Promise<boolean> {
    return (await this.collection.insertOne(registerRequestData)).acknowledged;
  }
}
