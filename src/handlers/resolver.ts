import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
  QueryGetSchoolByNameArgs,
  QueryGetSchoolsByLaArgs,
  LocalAuthority,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';

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
      callback(
        null,
        removeFields<School>(info.selectionSetList, school as unknown as Record<string, string>)
      );
      break;
    }
    case 'getSchoolsByLa': {
      const schools = await schoolDataRepository.getByLa(params.name);
      const filteredSchools = schools.map((school) =>
        removeFields<School>(info.selectionSetList, school as unknown as Record<string, string>)
      );
      callback(null, filteredSchools);
      break;
    }
    case 'getSchools': {
      const schools = await schoolDataRepository.list();
      const filteredSchools = schools.map((school) =>
        removeFields<School>(info.selectionSetList, school as unknown as Record<string, string>)
      );
      callback(null, filteredSchools);
      break;
    }
    case 'getLocalAuthorities': {
      const las = await localAuthorityDataRepository.list();
      const filteredLas = las.map((la) =>
        removeFields<LocalAuthority>(info.selectionSetList, la as unknown as Record<string, string>)
      );
      callback(null, filteredLas);
      break;
    }
    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};

const removeFields = <T>(selectionSetList: string[], obj: Record<string, string>): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (selectionSetList.includes(key)) {
      acc = { ...acc, [key]: value };
    }
    return acc;
  }, {} as T);
};
