import { MiddlewareObj } from '@middy/core';
import { logger } from '../logger';

export const inputLogger = (): MiddlewareObj => {
  return {
    before: (request) => {
      logger.info(`Running function with ${JSON.stringify(request)}`);
    },
  };
};
