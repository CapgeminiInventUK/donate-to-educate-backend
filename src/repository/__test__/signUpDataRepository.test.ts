import { MongoClient } from 'mongodb';
import { SignUpDataRepository } from '../signUpDataRepository';
import { signUpData } from './mockData/signUps';
import { SignUpData } from '../../../appsync';

describe('SignUpDataRepository', () => {
  const repo = SignUpDataRepository.getInstance();

  beforeAll(async () => {
    const client = new MongoClient(process.env.MONGO_URL ?? '');
    const collection = client.db('D2E').collection<SignUpData>('SignUps');
    await collection.insertMany(signUpData);
    await client.close();
  });

  afterAll(async () => {
    await repo.close();
  });

  it('Can get sign up by id', async () => {
    const signUp = await repo.getById(
      'TVbciClhpyAqGfyyUsBxyeEVOnbjKsjFUqityTrLvzZAAUSxHdELObPSTyMxTcGNJHiBPkKdsQhgRjbBZHlswqgauGNboOxaAWbY'
    );
    expect(signUp?.name).toEqual('Southwark');
  });

  it('Can insert sign up', async () => {
    const result = await repo.insert({
      id: 'Test',
      email: 'asdf@AS.com',
      type: 'charity',
      name: 'Southwark',
      nameId: '210',
    });
    expect(result).toEqual(true);

    const signUp = await repo.getById('Test');
    expect(signUp?.type).toEqual('charity');
  });
});
