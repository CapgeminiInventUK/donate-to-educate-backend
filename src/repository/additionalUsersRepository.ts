import { WithId } from 'mongodb';
import { AdditionalUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class AdditionalUsersRepository extends BaseRepository<AdditionalUser> {
  private static instance: AdditionalUsersRepository;

  static getInstance(): AdditionalUsersRepository {
    if (!this.instance) {
      this.instance = new AdditionalUsersRepository('AdditionalUsers');
    }
    return this.instance;
  }

  public async list(): Promise<WithId<AdditionalUser>[]> {
    return await this.getByQuery({});
  }

  public async getSchoolAdditionalUsers(school: string): Promise<WithId<AdditionalUser>[]> {
    return await this.getByQuery({ type: 'school', school });
  }

  public async getCharityAdditionalUsers(charityName: string): Promise<WithId<AdditionalUser>[]> {
    return await this.getByQuery({ type: 'charity', charityName });
  }

  public async getLaAdditionalUsers(localAuthority: string): Promise<WithId<AdditionalUser>[]> {
    return await this.getByQuery({ type: 'localAuthority', localAuthority });
  }

  public async insert(user: AdditionalUser): Promise<boolean> {
    return (await this.collection.insertOne(user)).acknowledged;
  }
}
