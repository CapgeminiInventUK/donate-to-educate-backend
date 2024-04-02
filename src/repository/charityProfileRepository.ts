import { WithId } from 'mongodb';
import { CharityProfile } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class CharityProfileRepository extends BaseRepository<CharityProfile> {
  private static instance: CharityProfileRepository;

  static getInstance(): CharityProfileRepository {
    if (!this.instance) {
      this.instance = new CharityProfileRepository('CharityProfile');
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

  public async deleteCharityProfile(name: string, id: string): Promise<boolean> {
    return (await this.collection.deleteOne({ name, id })).acknowledged;
  }
}
