import { AppSyncResolverHandler } from 'aws-lambda';
import { Post, QuerySinglePostArgs } from '../../appsync';

export const handler: AppSyncResolverHandler<QuerySinglePostArgs, Post> = (
  event,
  context,
  callback
) => {
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
