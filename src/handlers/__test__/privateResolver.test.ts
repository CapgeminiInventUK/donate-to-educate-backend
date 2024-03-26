import { handler } from '../privateResolver';
import { dropDatabase, generateContext, generateEvent } from '../../shared/testUtils';

describe('Private Resolver', () => {
  afterEach(async () => {
    await dropDatabase();
  });

  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(generateEvent('missingFieldName'), generateContext(), jest.fn());
    }).rejects.toThrow('Unexpected type missingFieldName');
  });
});
