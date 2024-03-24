import { SchoolProfileRepository } from '../schoolProfileRepository';
import { schoolProfile } from './mockData/schoolProfile';
import { SchoolProfile } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('SchoolProfileRepository', () => {
  const repo = SchoolProfileRepository.getInstance();

  beforeAll(async () => {
    await insertData<SchoolProfile>('SchoolProfile', schoolProfile);
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
