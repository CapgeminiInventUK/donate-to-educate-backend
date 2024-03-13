import { MongoClient } from 'mongodb';
import { CharityUserRepository } from '../charityUserRepository';
import { charityUser } from './mockData/charityUser';
import { CharityUser } from '../../../appsync';

describe('CharityUserRepository', () => {
  const repo = CharityUserRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<CharityUser>('CharityUser');
    await collection.insertMany(charityUser);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
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
    });
    expect(result).toEqual(true);

    const users = await repo.list();
    expect(users.length).toEqual(3);
  });
});
