import { AppSyncResolverHandler } from 'aws-lambda';
import { School, QueryGetSchoolByNameArgs } from '../../appsync';
import { logger } from '../shared/logger';

export const handler: AppSyncResolverHandler<QueryGetSchoolByNameArgs, School> = (
  event,
  _,
  callback
) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  const dummySchool = {
    urn: '100011',
    name: 'Brookfield Primary School',
    localAuthority: 'Camden',
    postcode: 'N19 5DH',
    registered: false,
  };

  switch (info.fieldName) {
    case 'singlePost':
      callback(null, dummySchool);
      break;
    default:
      callback(`Unexpected type ${info.fieldName}`);
      break;
  }
};
