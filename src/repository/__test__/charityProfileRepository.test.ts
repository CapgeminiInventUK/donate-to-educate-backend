import { beforeAll, describe, expect, it } from '@jest/globals';
import { CharityProfile } from '../../../appsync';
import { insertData } from '../../shared/testUtils';
import { CharityProfileRepository } from '../charityProfileRepository';
import { charityProfile } from './mockData/charityProfile';

describe('CharityProfileRepository', () => {
  const repo = CharityProfileRepository.getInstance();

  beforeAll(async () => {
    await insertData<CharityProfile>('CharityProfile', charityProfile);
  });

  it('Can get by name and id', async () => {
    const profile = await repo.getByName('Oxfam', '125821');
    expect(profile?.excess?.items).toEqual('{"Blazers":"Clothing and uniform"}');
  });

  it('Can update profile', async () => {
    const result = await repo.updateKey(
      '125821',
      'Oxfam',
      'excess',
      JSON.stringify({}),
      'West Sussex'
    );
    expect(result).toEqual(true);

    const profile = await repo.getByName('Oxfam', '125821');
    expect(profile?.excess).toEqual({});
  });
});
