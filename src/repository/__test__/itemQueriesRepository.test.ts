import { beforeAll, describe, expect, it } from '@jest/globals';
import { ItemQuery } from '../../../appsync';
import { insertData } from '../../shared/testUtils';
import { ItemQueriesRepository } from '../itemQueriesRepository';
import { itemQueries } from './mockData/itemQueries';

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
      organisationId: '12',
      organisationName: 'School',
      organisationType: 'school',
    });
    expect(result).toEqual(true);
  });
});
