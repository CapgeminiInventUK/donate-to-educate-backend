import { AppSyncResolverHandler } from 'aws-lambda';
import { Post, QuerySinglePostArgs } from '../../appsync';
import { logger } from '../shared/logger';

export const handler: AppSyncResolverHandler<QuerySinglePostArgs, Post> = (event, _, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'singlePost':
      callback(null, { id: '12', title: '12' });
      break;
    default:
      callback(`Unexpected type ${info.fieldName}`);
      break;
  }
};
