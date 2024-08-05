import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import middy from '@middy/core';
import { isTest } from '../env';

export const compression = (): middy.MiddlewareObj => {
  return {
    after: async (request) => {
      if (isTest()) {
        return;
      }

      const { response } = request;

      const stream = Readable.from(JSON.stringify(response)).pipe(createGzip());

      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const encodedResponse = Buffer.concat(chunks).toString('base64');

      request.response = encodedResponse;
    },
  };
};
