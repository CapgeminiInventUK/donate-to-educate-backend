import { MongoClientOptions, WithId } from 'mongodb';
import { CharityUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class CharityUserRepository extends BaseRepository<CharityUser> {
  private static instance: CharityUserRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): CharityUserRepository {
    if (!this.instance) {
      const options: MongoClientOptions = {
        authMechanism: 'MONGODB-AWS',
        authSource: '$external',
      };
      this.instance = isTest
        ? new CharityUserRepository('CharityUser', url ?? '')
        : new CharityUserRepository('CharityUser', url ?? '', options);
    }
    return this.instance;
  }

  public async getByEmail(email: string): Promise<WithId<CharityUser> | undefined> {
    return await this.getOne({ email });
  }

  public async list(): Promise<WithId<CharityUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(charity: CharityUser): Promise<boolean> {
    return (await this.collection.insertOne(charity)).acknowledged;
  }
}
