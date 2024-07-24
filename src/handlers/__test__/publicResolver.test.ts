import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';
import {
  LocalAuthorityUser,
  QueryGetLocalAuthorityUserArgs,
  QueryGetSchoolArgs,
  School,
} from '../../../appsync';
import { castToObjectWithBody } from '../../shared/object';
import { dropDatabase, generateContext, generateEvent, insertData } from '../../shared/testUtils';
import { handler } from '../publicResolver';

describe('Public Resolver', () => {
  afterEach(async () => {
    await dropDatabase();
  });

  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(generateEvent('missingFieldName'), generateContext());
    }).rejects.toThrow('Unexpected type missingFieldName');
  });

  it('Get School By Name - No results', async () => {
    const result = await handler(
      generateEvent<QueryGetSchoolArgs>('getSchool', ['name'], {
        name: 'Farlingaye',
        urn: '10000',
      }),
      generateContext()
    );

    expect(castToObjectWithBody(result).body).toEqual('[]');
  });

  it('Get School By Name - Results', async () => {
    await insertData<School>('SchoolData', [
      { name: 'Farlingaye', localAuthority: 'Hackney', registered: true, urn: '10000' },
    ]);

    const result = await handler(
      generateEvent<QueryGetSchoolArgs>('getSchool', ['name', 'urn'], {
        name: 'Farlingaye',
        urn: '10000',
      }),
      generateContext()
    );

    expect(castToObjectWithBody(result).body).toEqual(
      JSON.stringify({ name: 'Farlingaye', urn: '10000' })
    );
  });

  it('Get La User By Email - No results', async () => {
    const result = await handler(
      generateEvent<QueryGetLocalAuthorityUserArgs>('getLocalAuthorityUser', ['email'], {
        email: 'mock@example.com',
      }),
      generateContext()
    );

    expect(castToObjectWithBody(result).body).toEqual('null');
  });

  it('Get La User By Email - Results', async () => {
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

    const res = await handler(
      generateEvent<QueryGetLocalAuthorityUserArgs>('getLocalAuthorityUser', ['name', 'email'], {
        email: 'mock@example.com',
      }),
      generateContext()
    );

    expect(castToObjectWithBody(res).body).toEqual(
      JSON.stringify({ name: 'Hackney', email: 'mock@example.com' })
    );
  });

  it('Throws validation error when payload is not formatted correctly', async () => {
    const mockEvent = generateEvent('getLaStats', [], {
      name: 'Test',
      nameId: 'Test123',
      email: 'testemail', // This is not a valid email and should thus fail validation
    });
    const mockContext = generateContext();

    await expect(async () => {
      await handler(mockEvent, mockContext);
    }).rejects.toThrow(ZodError);
  });
});
