import { WithId } from 'mongodb';
import { SignUpData } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class SignUpDataRepository extends BaseRepository<SignUpData> {
  private static instance: SignUpDataRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): SignUpDataRepository {
    if (!this.instance) {
      this.instance = new SignUpDataRepository(
        'SignUps',
        url ?? '',
        isTest ? undefined : clientOptions
      );
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
