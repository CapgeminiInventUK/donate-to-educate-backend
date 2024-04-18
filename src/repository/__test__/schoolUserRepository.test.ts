import { SchoolUserRepository } from '../schoolUserRepository';
import { schoolUser } from './mockData/schoolUser';
import { SchoolUser } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('SchoolUserRepository', () => {
  const repo = SchoolUserRepository.getInstance();

  beforeAll(async () => {
    await insertData<SchoolUser>('SchoolUser', schoolUser);
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
      schoolName: 'Some School',
      schoolId: '1',
    });
    expect(result).toEqual(true);

    const users = await repo.list();
    expect(users.length).toEqual(3);
  });
});
