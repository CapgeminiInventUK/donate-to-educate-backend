import { MongoClient } from 'mongodb';
import { LocalAuthorityRegisterRequestsRepository } from '../localAuthorityRegisterRequestsRepository';
import { registerRequests } from './mockData/registerRequests';
import { LocalAuthorityRegisterRequest } from '../../../appsync';

describe('LocalAuthorityRegisterRequestsRepository', () => {
  const repo = LocalAuthorityRegisterRequestsRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client
      .db('D2E')
      .collection<LocalAuthorityRegisterRequest>('LocalAuthorityRegisterRequests');
    await collection.insertMany(registerRequests);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
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
