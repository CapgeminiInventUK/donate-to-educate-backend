import { handler } from '../privateResolver';
import { generateContext, generateEvent } from '../../shared/testUtils';

describe('Private Resolver', () => {
  it('Throws error if field name does not match', async () => {
    await expect(async () => {
      await handler(generateEvent('missingFieldName'), generateContext(), jest.fn());
    }).rejects.toThrow('Unexpected type missingFieldName');
  });
});
