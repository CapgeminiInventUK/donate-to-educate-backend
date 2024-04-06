import { WithId } from 'mongodb';
import { SchoolProfile } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { checkIfDefinedElseDefault } from '../shared/check';

export class SchoolProfileRepository extends BaseRepository<SchoolProfile> {
  private static instance: SchoolProfileRepository;

  static getInstance(): SchoolProfileRepository {
    if (!this.instance) {
      this.instance = new SchoolProfileRepository('SchoolProfile');
    }
    return this.instance;
  }

  public async getByName(name: string, id: string): Promise<WithId<SchoolProfile> | undefined> {
    return await this.getOne({ name, id });
  }

  public async updateKey(
    id: string,
    name: string,
    key: string,
    value: string,
    localAuthority: string,
    postcode: string | null
  ): Promise<boolean> {
    const parsedValue = key === 'about' ? value : (JSON.parse(value) as string);
    return (
      await this.collection.updateOne(
        { name, id },
        {
          $set: { [key]: parsedValue },
          $setOnInsert: { name, id, localAuthority, postcode: checkIfDefinedElseDefault(postcode) },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async deleteSchoolProfile(name: string, id: string): Promise<boolean> {
    return (await this.collection.deleteOne({ name, id })).acknowledged;
  }

  public async hasProfile(name: string, id: string): Promise<boolean> {
    return (await this.getCount({ name, id })) > 0;
  }
}
