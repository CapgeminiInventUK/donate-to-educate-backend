import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';
import { MutationRegisterLocalAuthorityArgs } from '../../../appsync';
import { dropDatabase, generateContext, generateEvent } from '../../shared/testUtils';
import { handler } from '../privateResolver';

describe('Private Resolver', () => {
  afterEach(async () => {
    await dropDatabase();
  });

  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(generateEvent('missingFieldName'), generateContext(), jest.fn());
    }).rejects.toThrow('Unexpected type missingFieldName');
  });

  it('Validates payload when payload is formatted correctly', async () => {
    const mockEvent = generateEvent<MutationRegisterLocalAuthorityArgs>(
      'registerLocalAuthority',
      [],
      {
        name: 'Testy McTest',
        firstName: 'Testy',
        lastName: 'McTest',
        email: 'testschool123@test.com',
        phone: '07123456789',
        department: 'Administration',
        jobTitle: 'Teacher',
        notes: undefined,
        nameId: '123FAKEID',
      }
    );
    const mockContext = generateContext();

    const res = await handler(mockEvent, mockContext, jest.fn());
    expect(res).toEqual(true);
  });

  it('Throws validation error when payload is not formatted correctly', async () => {
    const mockEvent = generateEvent('registerLocalAuthority', [], {
      name: 'Testy McTest',
      firstName: 'Testy',
      email: 'nottheemailyourelookingfor', // This is not a valid email and should thus fail validation
      phone: '07123456789',
      department: 'Administration',
      jobTitle: 'Teacher',
      notes: undefined,
      nameId: '123FAKEID',
    });
    const mockContext = generateContext();

    await expect(async () => {
      await handler(mockEvent, mockContext, jest.fn());
    }).rejects.toThrow(ZodError);
  });
});
