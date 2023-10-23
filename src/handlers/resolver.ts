import { AppSyncResolverHandler } from 'aws-lambda';
import { Post, QuerySinglePostArgs } from '../../appsync';
import { logger } from '../shared/logger';

export const handler: AppSyncResolverHandler<QuerySinglePostArgs, Post> = (
  event,
  context,
  callback
) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);

  switch (event.info.fieldName) {
    case 'singlePost': {
      const { id } = event.arguments;
      callback(null, { id, title: id });
      break;
    }
    default: {
      callback('Unknown field, unable to resolve' + event.info.fieldName);
      break;
    }
  }
};
