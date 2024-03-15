import { MongoClient } from 'mongodb';
import { SchoolProfileRepository } from '../schoolProfileRepository';
import { schoolProfile } from './mockData/schoolProfile';
import { SchoolProfile } from '../../../appsync';

describe('SchoolProfileRepository', () => {
  const repo = SchoolProfileRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<SchoolProfile>('SchoolProfile');
    await collection.insertMany(schoolProfile);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
  });

  it('Can get by name and id', async () => {
    const profile = await repo.getByName('Camelsdale Primary School', '125821');
    expect(profile?.excess?.items).toEqual('{"Blazers":"Clothing and uniform"}');
  });

  it('Can update profile', async () => {
    const result = await repo.updateKey(
      '125821',
      'Camelsdale Primary School',
      'excess',
      JSON.stringify({}),
      'West Sussex',
      'WO10%XW'
    );
    expect(result).toEqual(true);

    const profile = await repo.getByName('Camelsdale Primary School', '125821');
    expect(profile?.excess).toEqual({});
  });
});
