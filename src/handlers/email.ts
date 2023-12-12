import { Handler } from 'aws-lambda';

export const handler: Handler = (event, context, callback): void => {
  // eslint-disable-next-line no-console
  console.log(event);
  callback(null, 'Finished');
};
