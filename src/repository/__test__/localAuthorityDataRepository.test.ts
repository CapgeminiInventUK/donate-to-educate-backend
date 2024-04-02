import { LocalAuthorityDataRepository } from '../localAuthorityDataRepository';
import { laData } from './mockData/la';
import { LocalAuthority } from '../../../appsync';
import { createIndex, insertData } from '../../shared/testUtils';

describe('LocalAuthorityDataRepository', () => {
  const repo = LocalAuthorityDataRepository.getInstance();

  beforeAll(async () => {
    await insertData<LocalAuthority>('LocalAuthorityData', laData);
    await createIndex('LocalAuthorityData');
  });

  it('Can list all las', async () => {
    const las = await repo.list();
    expect(las[0].name).toEqual('City of London');
    expect(las[1].name).toEqual('Camden');
  });

  it('Can see la to registered', async () => {
    const res = await repo.setToRegistered('Camden');
    expect(res).toEqual(true);

    const las = await repo.list();
    expect(las[1].name).toEqual('Camden');
    expect(las[1].registered).toEqual(true);
  });

  // it('Can get school by la', async () => {
  //   const schools = await repo.getByLa('Camden');
  //   expect(schools[0].name).toEqual('Christ Church Primary School, Hampstead');
  //   expect(schools[0].localAuthority).toEqual('Camden');
  // });

  // it('Can get school by name', async () => {
  //   const school = await repo.getByName('The Aldgate School');
  //   expect(school?.name).toEqual('The Aldgate School');
  // });

  // it('Can get school by registered - no results', async () => {
  //   const schools = await repo.getRegistered();
  //   expect(schools).toEqual([]);
  // });
});
