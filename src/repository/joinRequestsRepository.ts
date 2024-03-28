import { WithId } from 'mongodb';
import { JoinRequest } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class JoinRequestsRepository extends BaseRepository<JoinRequest> {
  private static instance: JoinRequestsRepository;

  static getInstance(): JoinRequestsRepository {
    if (!this.instance) {
      this.instance = new JoinRequestsRepository('JoinRequests');
    }
    return this.instance;
  }

  public async list(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({});
  }

  public async getNewJoinRequests(): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({ status: 'NEW' });
  }

  public async getSchoolJoinRequestsCount(): Promise<number> {
    return await this.getCount({ status: 'NEW', type: 'school' });
  }

  public async getCharityJoinRequestsCount(): Promise<number> {
    return await this.getCount({ status: 'NEW', type: 'charity' });
  }

  public async getNewSchoolJoinRequestsByLa(
    localAuthority: string
  ): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({ status: 'NEW', type: 'school', localAuthority });
  }

  public async getNewCharityJoinRequestsByLa(
    localAuthority: string
  ): Promise<WithId<JoinRequest>[]> {
    return await this.getByQuery({ status: 'NEW', type: 'charity', localAuthority });
  }

  public async updateStatus(
    id: string,
    localAuthority: string,
    name: string,
    status: string
  ): Promise<boolean> {
    return (
      await this.collection.updateOne(
        { localAuthority, name, id },
        {
          $set: { status },
          $setOnInsert: { localAuthority, name, id },
        },
        { upsert: true }
      )
    ).acknowledged;
  }

  public async insert(user: JoinRequest): Promise<boolean> {
    return (await this.collection.insertOne(user)).acknowledged;
  }

  public async deleteDenied(id: string): Promise<boolean> {
    return (await this.collection.deleteOne({ id })).acknowledged;
  }
}
