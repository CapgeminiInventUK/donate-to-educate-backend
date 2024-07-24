import middy from '@middy/core';
import { logger } from '../logger';

export const inputLogger = (): middy.MiddlewareObj => {
  return {
    before: (request) => {
      logger.info(`Running function with ${JSON.stringify(request)}`);
    },
  };
};
