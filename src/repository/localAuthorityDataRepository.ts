import { WithId } from 'mongodb';
import { LocalAuthority } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class LocalAuthorityDataRepository extends BaseRepository<LocalAuthority> {
  private static instance: LocalAuthorityDataRepository;

  static getInstance(): LocalAuthorityDataRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityDataRepository('LocalAuthorityData');
    }
    return this.instance;
  }

  public async list(): Promise<WithId<LocalAuthority>[]> {
    return await this.getByQuery({});
  }

  public async setToRegistered(name: string): Promise<boolean> {
    return (await this.collection.updateOne({ name }, { $set: { registered: true } })).acknowledged;
  }

  public async getRegisteredLocalAuthorityCount(): Promise<number> {
    return await this.getCount({ registered: true });
  }

  public async getNotRegisteredLocalAuthorityCount(): Promise<number> {
    return await this.getCount({ registered: false });
  }
}
