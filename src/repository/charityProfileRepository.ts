import { WithId } from 'mongodb';
import { CharityProfile } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class CharityProfileRepository extends BaseRepository<CharityProfile> {
  private static instance: CharityProfileRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): CharityProfileRepository {
    if (!this.instance) {
      this.instance = isTest
        ? new CharityProfileRepository('CharityProfile', url ?? '')
        : new CharityProfileRepository('CharityProfile', url ?? '', clientOptions);
    }
    return this.instance;
  }

  public async getByName(name: string): Promise<WithId<CharityProfile> | undefined> {
    return await this.getOne({ name });
  }
}
