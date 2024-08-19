import { WithId } from 'mongodb';
import { SchoolUser } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class SchoolUserRepository extends BaseRepository<SchoolUser> {
  private static instance: SchoolUserRepository;

  static getInstance(): SchoolUserRepository {
    if (!this.instance) {
      this.instance = new SchoolUserRepository('SchoolUser');
    }
    return this.instance;
  }

  public async get(schoolName: string, schoolId: string): Promise<WithId<SchoolUser> | undefined> {
    return await this.getOne({ schoolName, schoolId });
  }

  public async getByEmail(email: string): Promise<WithId<SchoolUser> | undefined> {
    return await this.getOne({ email });
  }

  public async list(): Promise<WithId<SchoolUser>[]> {
    return await this.getByQuery({});
  }

  public async insert(school: SchoolUser): Promise<boolean> {
    return (await this.collection.insertOne(school)).acknowledged;
  }

  public async update(school: SchoolUser): Promise<boolean> {
    const { schoolId, schoolName } = school;
    return (await this.collection.updateOne({ schoolName, schoolId }, { $set: { ...school } }))
      .acknowledged;
  }
}
