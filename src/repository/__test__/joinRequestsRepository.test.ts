import { JoinRequestsRepository } from '../joinRequestsRepository';
import { joinRequests } from './mockData/joinRequests';
import { JoinRequest } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('JoinRequestsRepository', () => {
  const repo = JoinRequestsRepository.getInstance();

  beforeAll(async () => {
    await insertData<JoinRequest>('JoinRequests', joinRequests);
  });

  it('Can new join requests', async () => {
    const requests = await repo.getNewJoinRequests();
    expect(requests.length).toEqual(1);
  });

  it('Can list', async () => {
    const requests = await repo.list();
    expect(requests.length).toEqual(2);
  });

  it('Can insert', async () => {
    const result = await repo.insert({
      id: '1',
      name: 'Ryan Smith',
      localAuthority: 'Hackney',
      type: 'school',
      email: 'ryan.b.smith@capgemini.com',
      school: 'St John the Baptist Voluntary Aided Church of England Primary School - N1 6JG',
      jobTitle: 'sdv',
      phone: '07546547334',
      charityName: null,
      charityAddress: null,
      aboutCharity: null,
      status: 'DENIED',
      requestTime: 1709819190636,
    });
    expect(result).toEqual(true);
  });

  it('Can delete denied', async () => {
    const result = await repo.deleteDenied('Jake Readman');
    expect(result).toEqual(true);

    const requests = await repo.list();
    expect(requests.length).toEqual(2);
  });
});
