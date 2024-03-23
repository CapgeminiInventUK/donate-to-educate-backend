import { MongoClient } from 'mongodb';
import { LocalAuthorityDataRepository } from '../localAuthorityDataRepository';
import { laData } from './mockData/la';
import { LocalAuthority } from '../../../appsync';

describe('LocalAuthorityDataRepository', () => {
  const repo = LocalAuthorityDataRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<LocalAuthority>('LocalAuthorityData');
    await collection.insertMany(laData);
    await collection.createIndex({ location: '2dsphere' });
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
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
