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

  switch (info.fieldName) {
    case 'getSchoolByName': {
      const school = await schoolDataRepository.getByName(params.name);
      callback(null, school);
      break;
    }
    case 'getSchoolsByLa': {
      const schools = await schoolDataRepository.getByLa(params.name);
      callback(null, schools);
      break;
    }
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
