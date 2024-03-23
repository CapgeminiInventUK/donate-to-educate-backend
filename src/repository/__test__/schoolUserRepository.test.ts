import { MongoClient } from 'mongodb';
import { SchoolUserRepository } from '../schoolUserRepository';
import { schoolUser } from './mockData/schoolUser';
import { SchoolUser } from '../../../appsync';

describe('SchoolUserRepository', () => {
  const repo = SchoolUserRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<SchoolUser>('SchoolUser');
    await collection.insertMany(schoolUser);
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
      school: 'Some School',
    });
    expect(result).toEqual(true);

    const users = await repo.list();
    expect(users.length).toEqual(3);
  });
});
