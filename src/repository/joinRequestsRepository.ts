import { WithId } from 'mongodb';
import { JoinRequest } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class JoinRequestsRepository extends BaseRepository<JoinRequest> {
  private static instance: JoinRequestsRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): JoinRequestsRepository {
    if (!this.instance) {
      this.instance = new JoinRequestsRepository(
        'JoinRequests',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async list(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({});
  }

  public async getNewJoinRequests(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({ status: 'NEW' });
  }

  public async updateStatus(
    localAuthority: string,
    name: string,
    status: string
  ): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { localAuthority, name },
        {
          $set: { status },
          $setOnInsert: { localAuthority, name },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async insert(user: JoinRequest): Promise<boolean> {
    return (await this.collection.insertOne(user)).acknowledged;
  }

  public async deleteDenied(name: string): Promise<boolean> {
    return (await this.collection.deleteOne({ name, status: 'DENIED' })).acknowledged;
  }
}
