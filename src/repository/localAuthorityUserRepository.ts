import { WithId } from 'mongodb';
import { LocalAuthorityUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class LocalAuthorityUserRepository extends BaseRepository<LocalAuthorityUser> {
  private static instance: LocalAuthorityUserRepository;

  static getInstance(): LocalAuthorityUserRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityUserRepository('LocalAuthorityUser');
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
