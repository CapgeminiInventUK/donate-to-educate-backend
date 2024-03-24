import { MongoClient } from 'mongodb';
import { ItemQueriesRepository } from '../itemQueriesRepository';
import { itemQueries } from './mockData/itemQueries';
import { ItemQuery } from '../../../appsync';

describe('ItemQueriesRepository', () => {
  const repo = ItemQueriesRepository.getInstance();

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<ItemQuery>('ItemQueries');
    await collection.insertMany(itemQueries);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
  });

  it('Can insert', async () => {
    const result = await repo.insert({
      name: 'svb',
      email: 'ryan.b.example.com',
      type: 'plus',
      message: 'somehow.',
      who: 'anotherSchool',
      phone: '07654345843',
      organisationType: 'school',
    });
    expect(result).toEqual(true);
  });
});
