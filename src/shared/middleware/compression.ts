import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { MiddlewareObj } from '@middy/core';
import { isLocal, isTest } from '../env';

export const compression = (): MiddlewareObj => {
  return {
    after: async (request) => {
      if (!isLocal()) {
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
