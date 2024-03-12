import { MongoClientOptions } from 'mongodb';
import { LocalAuthorityRegisterRequest } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class LocalAuthorityRegisterRequestsRepository extends BaseRepository<LocalAuthorityRegisterRequest> {
  private static instance: LocalAuthorityRegisterRequestsRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): LocalAuthorityRegisterRequestsRepository {
    if (!this.instance) {
      const options: MongoClientOptions = {
        authMechanism: 'MONGODB-AWS',
        authSource: '$external',
      };
      this.instance = isTest
        ? new LocalAuthorityRegisterRequestsRepository('LocalAuthorityRegisterRequests', url ?? '')
        : new LocalAuthorityRegisterRequestsRepository(
            'LocalAuthorityRegisterRequests',
            url ?? '',
            options
          );
    }
    return this.instance;
  }

  public async insert(registerRequestData: LocalAuthorityRegisterRequest): Promise<boolean> {
    return (await this.collection.insertOne(registerRequestData)).acknowledged;
  }
}
