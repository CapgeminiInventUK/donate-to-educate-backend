import { WithId } from 'mongodb';
import { SignUpData } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class SignUpDataRepository extends BaseRepository<SignUpData> {
  private static instance: SignUpDataRepository;

  static getInstance(): SignUpDataRepository {
    if (!this.instance) {
      this.instance = new SignUpDataRepository('SignUps');
    }
    return this.instance;
  }

  public async getById(id: string): Promise<WithId<SignUpData> | undefined> {
    return await this.getOne({ id });
  }

  public async insert(signUpData: SignUpData): Promise<boolean> {
    return (await this.collection.insertOne(signUpData)).acknowledged;
  }
}
