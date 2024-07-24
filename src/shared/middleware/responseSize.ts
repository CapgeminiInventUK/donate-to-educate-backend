import middy from '@middy/core';
import sizeof from 'object-sizeof';
import { logger } from '../logger';

export const responseSize = (): middy.MiddlewareObj => {
  return {
    after: (request) => {
      logger.info(`Size of response ${sizeof(request)} bytes`);
    },
  };
};
