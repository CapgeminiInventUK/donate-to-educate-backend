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
      this.instance = new CharityProfileRepository(
        'CharityProfile',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async getByName(name: string, id: string): Promise<WithId<CharityProfile> | undefined> {
    return await this.getOne({ name, id });
  }

  public async updateKey(
    id: string,
    name: string,
    key: string,
    value: string,
    localAuthority: string
  ): Promise<boolean> {
    const parsedValue =
      key === 'about' || key === 'postcode' ? value : (JSON.parse(value) as string);
    return (
      await this.collection.updateOne(
        { name, id },
        {
          $set: { [key]: parsedValue },
          $setOnInsert: { name, id, localAuthority },
        },
        { upsert: true }
      )
    ).acknowledged;
  }
}
