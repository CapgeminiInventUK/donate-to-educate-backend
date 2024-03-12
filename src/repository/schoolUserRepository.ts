import { MongoClientOptions, WithId } from 'mongodb';
import { SchoolUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class SchoolUserRepository extends BaseRepository<SchoolUser> {
  private static instance: SchoolUserRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): SchoolUserRepository {
    if (!this.instance) {
      const options: MongoClientOptions = {
        authMechanism: 'MONGODB-AWS',
        authSource: '$external',
      };
      this.instance = isTest
        ? new SchoolUserRepository('SchoolUser', url ?? '')
        : new SchoolUserRepository('SchoolUser', url ?? '', options);
    }
    return this.instance;
  }

  public async getByEmail(email: string): Promise<WithId<SchoolUser> | undefined> {
    return await this.getOne({ email });
  }

  public async list(): Promise<WithId<SchoolUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(school: SchoolUser): Promise<boolean> {
    return (await this.collection.insertOne(school)).acknowledged;
  }
}
