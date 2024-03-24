import { LocalAuthorityRegisterRequestsRepository } from '../localAuthorityRegisterRequestsRepository';
import { registerRequests } from './mockData/registerRequests';
import { LocalAuthorityRegisterRequest } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('LocalAuthorityRegisterRequestsRepository', () => {
  const repo = LocalAuthorityRegisterRequestsRepository.getInstance();

  beforeAll(async () => {
    await insertData<LocalAuthorityRegisterRequest>(
      'LocalAuthorityRegisterRequests',
      registerRequests
    );
  });

  it('Can insert', async () => {
    const result = await repo.insert({
      email: 'test@example.com',
      message: '123',
      name: 'Minnie',
      localAuthority: 'Hackney',
      type: 'school',
    });
    expect(result).toEqual(true);
  });
});
