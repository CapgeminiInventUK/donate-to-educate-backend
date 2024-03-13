import { LocalAuthorityRegisterRequest } from '../../appsync';
import { BaseRepository } from './baseRepository';
import { clientOptions } from './config';

export class LocalAuthorityRegisterRequestsRepository extends BaseRepository<LocalAuthorityRegisterRequest> {
  private static instance: LocalAuthorityRegisterRequestsRepository;

  static getInstance(
    url = process?.env?.MONGODB_CONNECTION_STRING,
    isTest = false
  ): LocalAuthorityRegisterRequestsRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityRegisterRequestsRepository(
        'LocalAuthorityRegisterRequests',
        url ?? '',
        isTest ? undefined : clientOptions
      );
    }
    return this.instance;
  }

  public async insert(registerRequestData: LocalAuthorityRegisterRequest): Promise<boolean> {
    return (await this.collection.insertOne(registerRequestData)).acknowledged;
  }
}
