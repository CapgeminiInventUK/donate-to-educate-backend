import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { JoinRequest } from '../../appsync';

export class JoinRequestsRepository {
  private static instance: JoinRequestsRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<JoinRequest>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      { authMechanism: 'MONGODB-AWS', authSource: '$external' }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<JoinRequest>('JoinRequests');
  }

  static getInstance(): JoinRequestsRepository {
    if (!this.instance) {
      this.instance = new JoinRequestsRepository();
    }
    return this.instance;
  }

  private async getByQuery(query: Filter<JoinRequest>): Promise<WithId<JoinRequest>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }

  public async list(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({});
  }

  public async getNewJoinRequests(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({ status: 'NEW' });
  }

  public async updateStatus(
    localAuthority: string,
    name: string,
    status: string
  ): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { localAuthority, name },
        {
          $set: { status },
          $setOnInsert: { localAuthority, name },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async insert(user: JoinRequest): Promise<boolean> {
    return (await this.collection.insertOne(user)).acknowledged;
  }

  public async deleteDenied(name: string): Promise<boolean> {
    return (await this.collection.deleteOne({ name, status: 'DENIED' })).acknowledged;
  }
}
