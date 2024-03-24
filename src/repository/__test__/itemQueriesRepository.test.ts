import { ItemQueriesRepository } from '../itemQueriesRepository';
import { itemQueries } from './mockData/itemQueries';
import { ItemQuery } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('ItemQueriesRepository', () => {
  const repo = ItemQueriesRepository.getInstance();

  beforeAll(async () => {
    await insertData<ItemQuery>('ItemQueries', itemQueries);
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
