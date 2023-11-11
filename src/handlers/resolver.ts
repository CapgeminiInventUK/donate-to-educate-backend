import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
  QueryGetSchoolByNameArgs,
  QueryGetSchoolsByLaArgs,
  LocalAuthority,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository1';

const schoolDataRepository = SchoolDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  QueryGetSchoolByNameArgs | QueryGetSchoolsByLaArgs,
  School | School[] | LocalAuthority[]
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
    case 'getLocalAuthorities': {
      const las = await localAuthorityDataRepository.list();
      callback(null, las);
      break;
    }
    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};
