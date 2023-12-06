import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
  QueryGetSchoolByNameArgs,
  QueryGetSchoolsByLaArgs,
  LocalAuthority,
  JoinRequest,
  MutationRegisterLocalAuthorityArgs,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityRepository } from '../repository/localAuthorityRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';

const schoolDataRepository = SchoolDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityRepository = LocalAuthorityRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();

export const handler: AppSyncResolverHandler<
  QueryGetSchoolByNameArgs | QueryGetSchoolsByLaArgs | MutationRegisterLocalAuthorityArgs,
  School | School[] | LocalAuthority[] | JoinRequest[] | boolean
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'getSchoolByName': {
      const { name } = params;
      const school = await schoolDataRepository.getByName(name);
      if (!school) {
        callback(null);
        break;
      }
      callback(null, removeFields<School>(info.selectionSetList, school));
      break;
    }
    case 'getSchoolsByLa': {
      const { name } = params;
      const schools = await schoolDataRepository.getByLa(name);
      const filteredSchools = schools.map((school) =>
        removeFields<School>(info.selectionSetList, school)
      );
      callback(null, filteredSchools);
      break;
    }
    case 'getSchools': {
      const schools = await schoolDataRepository.list();
      const filteredSchools = schools.map((school) =>
        removeFields<School>(info.selectionSetList, school)
      );
      callback(null, filteredSchools);
      break;
    }
    case 'getLocalAuthorities': {
      const las = await localAuthorityDataRepository.list();
      const filteredLas = las.map((la) => removeFields<LocalAuthority>(info.selectionSetList, la));
      callback(null, filteredLas);
      break;
    }
    case 'getJoinRequests': {
      const requests = await joinRequestsRepository.list();
      callback(null, requests);
      break;
    }
    case 'registerLocalAuthority': {
      const { name, firstName, lastName, email, phone, department, jobTitle, notes } =
        params as MutationRegisterLocalAuthorityArgs;
      const register = await localAuthorityDataRepository.setToRegistered(name);
      const insert = await localAuthorityRepository.insert({
        localAuthorityName: name,
        firstName,
        lastName,
        email,
        phone,
        department,
        jobTitle,
        notes,
      });
      callback(null, register && insert);
      break;
    }
    default: {
      callback(`Unexpected type ${info.fieldName}`);
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }

  throw new Error('An unknown error occurred');
};

const removeFields = <T extends object>(selectionSetList: string[], obj: T): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (selectionSetList.includes(key)) {
      acc = { ...acc, [key]: value as string };
    }
    return acc;
  }, {} as T);
};
