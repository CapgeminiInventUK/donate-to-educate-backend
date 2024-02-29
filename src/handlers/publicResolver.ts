import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
  QueryGetSchoolByNameArgs,
  QueryGetSchoolsByLaArgs,
  LocalAuthority,
  JoinRequest,
  SchoolProfile,
  QueryGetSignUpDataArgs,
  QueryGetSchoolProfileArgs,
  QueryGetLocalAuthorityUserArgs,
  SignUpData,
  LocalAuthorityUser,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { removeFields } from '../shared/graphql';

const schoolDataRepository = SchoolDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | QueryGetSchoolByNameArgs
  | QueryGetSchoolsByLaArgs
  | QueryGetSignUpDataArgs
  | QueryGetLocalAuthorityUserArgs,
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
      const laUser = await localAuthorityUserRepository.getByEmail(email);

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
    case 'getSchoolProfile': {
      const { name } = params as QueryGetSchoolProfileArgs;
      const res = await schoolProfileRepository.getByName(name);
      callback(null, res);
      break;
    }
    case 'getSignUpData': {
      const { id } = params as QueryGetSignUpDataArgs;
      const res = await signUpDataRepository.getById(id);
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