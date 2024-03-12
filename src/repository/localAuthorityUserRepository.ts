import { WithId } from 'mongodb';
import { LocalAuthorityUser } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class LocalAuthorityUserRepository extends BaseRepository<LocalAuthorityUser> {
  private static instance: LocalAuthorityUserRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): LocalAuthorityUserRepository {
    if (!this.instance) {
      this.instance = isTest
        ? new LocalAuthorityUserRepository('LocalAuthorityUser', url ?? '')
        : new LocalAuthorityUserRepository('LocalAuthorityUser', url ?? '', clientOptions);
    }
    return this.instance;
  }

  public async getByEmail(email: string): Promise<WithId<LocalAuthorityUser> | undefined> {
    return await this.getOne({ email });
  }

  public async getByName(name: string): Promise<WithId<LocalAuthorityUser> | undefined> {
    return await this.getOne({ name });
  }

  public async list(): Promise<WithId<LocalAuthorityUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(la: LocalAuthorityUser): Promise<boolean> {
    return (await this.collection.insertOne(la)).acknowledged;
  }
}
