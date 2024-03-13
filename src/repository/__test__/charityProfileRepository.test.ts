import { MongoClient } from 'mongodb';
import { CharityProfileRepository } from '../charityProfileRepository';
import { charityProfile } from './mockData/charityProfile';
import { CharityProfile } from '../../../appsync';

describe('CharityProfileRepository', () => {
  const repo = CharityProfileRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<CharityProfile>('CharityProfile');
    await collection.insertMany(charityProfile);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
  });

  it('Can get by name and id', async () => {
    const profile = await repo.getByName('Oxfam');
    expect(profile?.excess?.items).toEqual('{"Blazers":"Clothing and uniform"}');
  });
});
