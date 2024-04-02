import { LocalAuthorityRegisterRequest } from '../../appsync';
import { BaseRepository } from './baseRepository';

export class LocalAuthorityRegisterRequestsRepository extends BaseRepository<LocalAuthorityRegisterRequest> {
  private static instance: LocalAuthorityRegisterRequestsRepository;

  static getInstance(): LocalAuthorityRegisterRequestsRepository {
    if (!this.instance) {
      this.instance = new LocalAuthorityRegisterRequestsRepository(
        'LocalAuthorityRegisterRequests'
      );
    }
    return this.instance;
  }

  public async insert(registerRequestData: LocalAuthorityRegisterRequest): Promise<boolean> {
    return (await this.collection.insertOne(registerRequestData)).acknowledged;
  }
}
