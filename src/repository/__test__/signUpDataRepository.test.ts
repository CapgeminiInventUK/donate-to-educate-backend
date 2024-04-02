import { SignUpDataRepository } from '../signUpDataRepository';
import { signUpData } from './mockData/signUps';
import { SignUpData } from '../../../appsync';
import { insertData } from '../../shared/testUtils';

describe('SignUpDataRepository', () => {
  const repo = SignUpDataRepository.getInstance();

  beforeAll(async () => {
    await insertData<SignUpData>('SignUps', signUpData);
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
