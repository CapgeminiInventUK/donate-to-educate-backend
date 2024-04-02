import { handler } from '../privateResolver';
import { dropDatabase, generateContext, generateEvent } from '../../shared/testUtils';
import { MutationRegisterLocalAuthorityArgs } from '../../../appsync';
import { ZodError } from 'zod';

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

    const mockCallback = jest.fn();

    await expect(async () => {
      await handler(mockEvent, mockContext, mockCallback);
    }).rejects.toThrow('An unknown error occurred');

    expect(mockCallback).toHaveBeenCalled();
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

    const mockCallback = jest.fn();

    await expect(async () => {
      await handler(mockEvent, mockContext, mockCallback);
    }).rejects.toThrow(ZodError);

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
