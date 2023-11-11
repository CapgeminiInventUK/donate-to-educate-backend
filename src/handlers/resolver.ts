import { AppSyncResolverHandler } from 'aws-lambda';
import { School, QueryGetSchoolByNameArgs, QueryGetSchoolsByLaArgs } from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';

const schoolDataRepository = SchoolDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  QueryGetSchoolByNameArgs | QueryGetSchoolsByLaArgs,
  School | School[]
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

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
    case 'getSchoolsByLa': {
      const schools = await schoolDataRepository.getByLa(params.name);
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
