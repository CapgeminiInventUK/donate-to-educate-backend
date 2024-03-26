import {
  LocalAuthorityUser,
  QueryGetLocalAuthorityUserArgs,
  QueryGetSchoolByNameArgs,
  School,
} from '../../../appsync';
import { handler } from '../publicResolver';
import { dropDatabase, generateContext, generateEvent, insertData } from '../../shared/testUtils';

describe('Public Resolver', () => {
  afterEach(async () => {
    await dropDatabase();
  });

  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(generateEvent('missingFieldName'), generateContext(), jest.fn());
    }).rejects.toThrow('Unexpected type missingFieldName');
  });

  it('Get School By Name - No results', async () => {
    const callback = jest.fn();

    await expect(async () => {
      await handler(
        generateEvent<QueryGetSchoolByNameArgs>('getSchoolByName', ['name'], {
          name: 'Farlingaye',
        }),
        generateContext(),
        callback
      );
    }).rejects.toThrow('An unknown error occurred');

    expect(callback).toHaveBeenCalledWith(null);
  });

  it('Get School By Name - Results', async () => {
    const callback = jest.fn();
    await insertData<School>('SchoolData', [
      { name: 'Farlingaye', localAuthority: 'Hackney', registered: true, urn: '0' },
    ]);

    await expect(async () => {
      await handler(
        generateEvent<QueryGetSchoolByNameArgs>('getSchoolByName', ['name', 'urn'], {
          name: 'Farlingaye',
        }),
        generateContext(),
        callback
      );
    }).rejects.toThrow('An unknown error occurred');

    expect(callback).toHaveBeenCalledWith(null, { name: 'Farlingaye', urn: '0' });
  });

  it('Get La User By Email - No results', async () => {
    const callback = jest.fn();

    await expect(async () => {
      await handler(
        generateEvent<QueryGetLocalAuthorityUserArgs>('getLocalAuthorityUser', ['email'], {
          email: 'mock@example.com',
        }),
        generateContext(),
        callback
      );
    }).rejects.toThrow('An unknown error occurred');

    expect(callback).toHaveBeenCalledWith(null);
  });

  it('Get La User By Email - Results', async () => {
    const callback = jest.fn();
    await insertData<LocalAuthorityUser>('LocalAuthorityUser', [
      {
        name: 'Hackney',
        email: 'mock@example.com',
        department: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        nameId: '',
        phone: '',
      },
    ]);

    await expect(async () => {
      await handler(
        generateEvent<QueryGetLocalAuthorityUserArgs>('getLocalAuthorityUser', ['name', 'email'], {
          email: 'mock@example.com',
        }),
        generateContext(),
        callback
      );
    }).rejects.toThrow('An unknown error occurred');

    expect(callback).toHaveBeenCalledWith(null, { name: 'Hackney', email: 'mock@example.com' });
  });
});
