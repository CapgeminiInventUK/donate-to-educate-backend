import { MongoClient } from 'mongodb';
import { SchoolDataRepository } from '../schoolDataRepository';
import { schoolsData } from './mockData/schools';
import { School } from '../../../appsync';

describe('SchoolDataRepository', () => {
  const repo = SchoolDataRepository.getInstance(process.env.MONGO_URL, true);

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<School>('SchoolData');
    await collection.insertMany(schoolsData);
    await collection.createIndex({ location: '2dsphere' });
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
  });

  it('Can list all schools', async () => {
    const schools = await repo.list({});
    expect(schools[0].name).toEqual('The Aldgate School');
    expect(schools[1].name).toEqual('Christ Church Primary School, Hampstead');
  });

  it('Can get school by la', async () => {
    const schools = await repo.getByLa('Camden');
    expect(schools[0].name).toEqual('Christ Church Primary School, Hampstead');
    expect(schools[0].localAuthority).toEqual('Camden');
  });

  it('Can get school by name', async () => {
    const school = await repo.getByName('The Aldgate School');
    expect(school?.name).toEqual('The Aldgate School');
  });

  it('Can get school by registered - no results', async () => {
    const schools = await repo.getRegistered();
    expect(schools).toEqual([]);
  });

  it('Can get schools nearby - no results', async () => {
    const schools = await repo.getSchoolsNearby(0, 0, 0);
    expect(schools).toEqual([]);
  });

  it('Can get schools nearby - results', async () => {
    const schools = await repo.getSchoolsNearby(-0.07753063157783481, 51.51396882025788, 100);
    expect(schools.length).toEqual(1);
  });
});
