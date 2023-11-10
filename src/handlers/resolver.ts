import { AppSyncResolverHandler } from 'aws-lambda';
import { School, QueryGetSchoolByNameArgs } from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';

const schoolDataRepository = SchoolDataRepository.getInstance();

export const handler: AppSyncResolverHandler<QueryGetSchoolByNameArgs, School | School[]> = async (
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
    case 'getSchoolByName':
      callback(null, dummySchool);
      break;
    case 'getSchools': {
      const schools = await schoolDataRepository.list();
      callback(null, schools);
      break;
    }
    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};
