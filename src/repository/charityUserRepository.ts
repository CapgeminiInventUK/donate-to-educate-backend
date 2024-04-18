import { WithId } from 'mongodb';
import { CharityUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class CharityUserRepository extends BaseRepository<CharityUser> {
  private static instance: CharityUserRepository;

  static getInstance(): CharityUserRepository {
    if (!this.instance) {
      this.instance = new CharityUserRepository('CharityUser');
    }
    return this.instance;
  }

  public async get(
    charityName: string,
    charityId: string
  ): Promise<WithId<CharityUser> | undefined> {
    return await this.getOne({ charityName, charityId });
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
