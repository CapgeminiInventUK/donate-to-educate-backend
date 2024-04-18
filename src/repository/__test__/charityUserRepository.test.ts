import { CharityUserRepository } from '../charityUserRepository';
import { charityUser } from './mockData/charityUser';
import { CharityUser } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('CharityUserRepository', () => {
  const repo = CharityUserRepository.getInstance();

  beforeAll(async () => {
    await insertData<CharityUser>('CharityUser', charityUser);
  });

  it('Can get by email', async () => {
    const user = await repo.getByEmail('Test@minnie.com');
    expect(user?.name).toEqual('Minnie');
  });

  it('Can list', async () => {
    const users = await repo.list();
    expect(users.length).toEqual(2);
  });

  it('Can insert', async () => {
    const result = await repo.insert({
      email: 'Test@mickey.com',
      jobTitle: 'Mr',
      name: 'Mickey',
      phone: '07545432432',
      charityId: '1',
      charityName: 'Oxfam',
    });
    expect(result).toEqual(true);

    const users = await repo.list();
    expect(users.length).toEqual(3);
  });
});
