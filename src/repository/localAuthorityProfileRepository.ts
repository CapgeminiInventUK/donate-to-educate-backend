import { Collection, Db, Filter, MongoClient, WithId } from 'mongodb';
import { LocalAuthority, LocalAuthorityProfile, LocalAuthorityUser } from '../../appsync';
export class LocalAuthorityProfileRepository {
  private static instance: LocalAuthorityProfileRepository;
  private readonly client: MongoClient;
  private readonly db: Db;
  private readonly collection: Collection<LocalAuthorityProfile>;

  private constructor() {
    this.client = new MongoClient(
      process?.env?.MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/',
      {
        auth: { username: 'user', password: 'user' },
      }
    );
    this.db = this.client.db('D2E');
    this.collection = this.db.collection<LocalAuthorityProfile>('LocalAuthorityProfile');
  }

  static getInstance(): LocalAuthorityProfileRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityProfileRepository();
    }
    return this.instance;
  }

  public async updateLaProfile(localAuthority: string, user: string): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { 'localAuthority.name': (JSON.parse(localAuthority) as LocalAuthority).name },
        {
          $set: {
            user: JSON.parse(user) as LocalAuthorityUser,
            localAuthority: JSON.parse(localAuthority) as LocalAuthority,
          },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async getByUser(email: string): Promise<WithId<LocalAuthorityProfile>> {
    return (await this.getByQuery({ 'user.email': email })).at(0)!;
  }

  private async getByQuery(
    query: Filter<LocalAuthorityProfile>
  ): Promise<WithId<LocalAuthorityProfile>[]> {
    const cursor = this.collection.find(query);

    if (!(await cursor.hasNext())) {
      return [];
    }

    return await cursor.toArray();
  }
}
