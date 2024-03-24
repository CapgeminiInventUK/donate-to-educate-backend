import { LocalAuthorityUserRepository } from '../localAuthorityUserRepository';
import { laUser } from './mockData/laUser';
import { LocalAuthorityUser } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('LocalAuthorityUserRepository', () => {
  const repo = LocalAuthorityUserRepository.getInstance();

  beforeAll(async () => {
    await insertData<LocalAuthorityUser>('LocalAuthorityUser', laUser);
  });

  it('Can get by email', async () => {
    const la = await repo.getByEmail('asdf@AS.com');
    expect(la?.name).toEqual('Southwark');
  });

  it('Can get by name', async () => {
    const la = await repo.getByName('Southwark');
    expect(la?.email).toEqual('asdf@AS.com');
  });

  it('Can list', async () => {
    const users = await repo.list();
    expect(users.length).toEqual(2);
  });

  it('Can insert', async () => {
    const result = await repo.insert({
      name: 'Lewisham 2',
      firstName: 'Ryan',
      lastName: 'Smith',
      email: 'ryan.b.smith@2example.com',
      phone: '07854567869',
      department: 'advss',
      jobTitle: 'sdvs',
      notes: '',
      nameId: '206',
    });
    expect(result).toEqual(true);

    const users = await repo.list();
    expect(users.length).toEqual(3);
  });
});
