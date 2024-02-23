import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
  QueryGetSchoolByNameArgs,
  QueryGetSchoolsByLaArgs,
  LocalAuthority,
  JoinRequest,
  MutationRegisterLocalAuthorityArgs,
  SchoolProfile,
  MutationUpdateSchoolProfileArgs,
  MutationUpdateJoinRequestArgs,
  QueryGetSignUpDataArgs,
  MutationInsertSignUpDataArgs,
  QueryGetSchoolProfileArgs,
  QueryGetLocalAuthorityUserArgs,
  SignUpData,
  LocalAuthorityUser,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityRepository } from '../repository/localAuthorityRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';

const schoolDataRepository = SchoolDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityRepository = LocalAuthorityRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | QueryGetSchoolByNameArgs
  | QueryGetSchoolsByLaArgs
  | MutationRegisterLocalAuthorityArgs
  | QueryGetSignUpDataArgs
  | MutationInsertSignUpDataArgs,
  | School
  | School[]
  | LocalAuthority[]
  | JoinRequest[]
  | boolean
  | SchoolProfile
  | SignUpData
  | LocalAuthorityUser
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  switch (info.fieldName) {
    case 'getSchoolByName': {
      const { name } = params as QueryGetSchoolByNameArgs;
      const school = await schoolDataRepository.getByName(name);
      if (!school) {
        callback(null);
        break;
      }
      callback(null, removeFields<School>(info.selectionSetList, school));
      break;
    }
    case 'getLocalAuthorityUser': {
      const { email } = params as QueryGetLocalAuthorityUserArgs;
      const laUser = await localAuthorityRepository.getByEmail(email);

      if (!laUser) {
        callback(null);
        break;
      }
      callback(null, removeFields<LocalAuthorityUser>(info.selectionSetList, laUser));
      break;
    }
    case 'getSchoolsByLa': {
      const { name } = params as QueryGetSchoolsByLaArgs;
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
      const localAuthorities = await localAuthorityDataRepository.list();
      const filteredLas = localAuthorities.map((la) =>
        removeFields<LocalAuthority>(info.selectionSetList, la)
      );
      const mappedSchools = filteredSchools.map((school) => {
        const { localAuthority } = school;
        const isLocalAuthorityRegistered = filteredLas.find(
          ({ name }) => name === localAuthority
        )?.registered;
        return { ...school, isLocalAuthorityRegistered };
      });
      callback(null, mappedSchools);
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
        name,
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
    case 'getSchoolProfile': {
      const { name } = params as QueryGetSchoolProfileArgs;
      const res = await schoolProfileRepository.getByName(name);
      callback(null, res);
      break;
    }
    case 'updateJoinRequest': {
      const { localAuthority, name, status } = params as MutationUpdateJoinRequestArgs;
      const res = await joinRequestsRepository.updateStatus(localAuthority, name, status);
      callback(null, res);
      break;
    }
    case 'updateSchoolProfile': {
      const { name, key, value } = params as MutationUpdateSchoolProfileArgs;
      const res = await schoolProfileRepository.updateKey(name, key, value);
      callback(null, res);
      break;
    }
    case 'getSignUpData': {
      const { id } = params as QueryGetSignUpDataArgs;
      const res = await signUpDataRepository.getById(id);
      callback(null, res);
      break;
    }
    case 'insertSignUpData': {
      const { id, email, type } = params as MutationInsertSignUpDataArgs;
      const res = await signUpDataRepository.insert({ id, email, type });
      callback(null, res);
      break;
    }
    case 'getRegisteredSchools': {
      const res = await schoolDataRepository.getRegistered();
      callback(null, res);
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
