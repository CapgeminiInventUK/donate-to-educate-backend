import { WithId } from 'mongodb';
import { SchoolProfile } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class SchoolProfileRepository extends BaseRepository<SchoolProfile> {
  private static instance: SchoolProfileRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): SchoolProfileRepository {
    if (!this.instance) {
      this.instance = isTest
        ? new SchoolProfileRepository('SchoolProfile', url ?? '')
        : new SchoolProfileRepository('SchoolProfile', url ?? '', clientOptions);
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
    localAuthority: string
  ): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { name, id },
        {
          $set: { [key]: JSON.parse(value) as string },
          $setOnInsert: { name, id, localAuthority },
        },
        { upsert: true }
      )
    ).acknowledged;
  }
}
