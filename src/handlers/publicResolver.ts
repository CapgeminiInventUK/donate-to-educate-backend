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
  QueryGetSchoolsNearbyArgs,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { removeFields } from '../shared/graphql';
import { convertPostcodeToLatLng } from '../shared/postcode';

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
  | QueryGetSchoolsNearbyArgs
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

  const projectedFields = info.selectionSetList
    .replace(/\[|\]/gm, '')
    .split(', ')
    .reduce((acc, item) => ({ ...acc, [item]: 1 }), {});
  logger.info(`Projected fields ${JSON.stringify(projectedFields)}`);

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
      const schools = await schoolDataRepository.list(projectedFields);
      const localAuthorities = await localAuthorityDataRepository.list();
      const filteredLas = localAuthorities.map((la) =>
        removeFields<LocalAuthority>(info.selectionSetList, la)
      );
      const mappedSchools = schools.map((school) => {
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
      const requests = await joinRequestsRepository.getNewJoinRequests();
      callback(null, requests);
      break;
    }
    case 'getSchoolProfile': {
      const { name, id } = params as QueryGetSchoolProfileArgs;
      const res = await schoolProfileRepository.getByName(name, id);
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
    case 'getSchoolsNearby': {
      const { postcode, distance } = params as QueryGetSchoolsNearbyArgs;

      const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

      const res = await schoolDataRepository.getSchoolsNearby(longitude, latitude, distance);
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
