import { AppSyncResolverHandler } from 'aws-lambda';
import {
  School,
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
  QueryGetRegisteredSchoolsByLaArgs,
  QueryGetSchoolJoinRequestsByLaArgs,
  QueryGetCharityProfileArgs,
  CharityProfile,
  QueryGetCharitiesNearbyArgs,
  Charity,
  AdminStats,
  InstituteSearchResult,
  QueryGetSchoolsNearbyWithProfileArgs,
  QueryGetCharitiesNearbyWithProfileArgs,
  QueryGetCharitiesByLaArgs,
  QueryGetCharityJoinRequestsByLaArgs,
  QueryGetLaStatsArgs,
  LaStats,
  QueryGetSchoolArgs,
  QueryHasSchoolProfileArgs,
  QueryHasCharityProfileArgs,
} from '../../appsync';
import { logger } from '../shared/logger';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { removeFields } from '../shared/graphql';
import { convertPostcodeToLatLng } from '../shared/postcode';
import { CharityDataRepository } from '../repository/charityDataRepository';
import {
  getCharitiesByLaSchema,
  getCharitiesNearbySchema,
  getCharitiesNearbyWithProfileSchema,
  getCharityJoinRequestsByLaSchema,
  getCharityProfileSchema,
  getLaStatsSchema,
  getLocalAuthorityUserSchema,
  getRegisteredSchoolsByLaSchema,
  getSchoolByNameSchema,
  getSchoolJoinRequestsByLaSchema,
  getSchoolProfileSchema,
  getSchoolsByLaSchema,
  getSchoolsNearbySchema,
  getSchoolsNearbyWithProfileSchema,
  getSignUpDataSchema,
} from './zodSchemas';

const schoolDataRepository = SchoolDataRepository.getInstance();
const charityDataRepository = CharityDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const charityProfileRepository = CharityProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | QueryGetSchoolsByLaArgs
  | QueryGetSignUpDataArgs
  | QueryGetSchoolsNearbyArgs
  | QueryGetCharitiesNearbyArgs
  | QueryGetRegisteredSchoolsByLaArgs
  | QueryGetCharityProfileArgs
  | QueryGetSchoolArgs
  | QueryGetLocalAuthorityUserArgs,
  | School
  | School[]
  | Charity[]
  | LocalAuthority[]
  | JoinRequest[]
  | InstituteSearchResult[]
  | boolean
  | SchoolProfile
  | CharityProfile
  | SignUpData
  | LocalAuthorityUser
  | AdminStats
  | LaStats
  | QueryGetSchoolJoinRequestsByLaArgs
  | QueryGetSchoolProfileArgs
  | QueryGetSchoolsNearbyWithProfileArgs
  | QueryGetCharitiesNearbyWithProfileArgs
  | QueryGetCharitiesByLaArgs
  | QueryGetCharityJoinRequestsByLaArgs
  | QueryGetLaStatsArgs
> = async (event, context, callback) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

  const { arguments: params, info } = event;
  logger.info(`${JSON.stringify(params)}`);

  logger.info(typeof info.selectionSetList);

  const selections =
    typeof info.selectionSetList === 'string'
      ? (info.selectionSetList as string).replace(/\[|\]/gm, '').split(', ')
      : info.selectionSetList;

  const projectedFields: Record<string, number> = selections.reduce(
    (acc: Record<string, number>, item: string) => ({ ...acc, [item]: 1 }),
    {}
  );
  logger.info(`Projected fields ${JSON.stringify(projectedFields)}`);

  switch (info.fieldName) {
    case 'getSchoolByName': {
      const { name } = getSchoolByNameSchema.parse(params);

      const school = await schoolDataRepository.getByName(name);
    case 'getSchool': {
      const { name, urn } = params as QueryGetSchoolArgs;
      const school = await schoolDataRepository.get(name, urn);

      if (!school) {
        callback(null);
        break;
      }
      callback(null, removeFields<School>(info.selectionSetList, school));
      break;
    }
    case 'getLocalAuthorityUser': {
      const { email } = getLocalAuthorityUserSchema.parse(params);

      const laUser = await localAuthorityUserRepository.getByEmail(email);

      if (!laUser) {
        callback(null);
        break;
      }
      callback(null, removeFields<LocalAuthorityUser>(info.selectionSetList, laUser));
      break;
    }
    case 'getSchoolsByLa': {
      const { name } = getSchoolsByLaSchema.parse(params);

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
      const { name, id } = getSchoolProfileSchema.parse(params);

      const res = await schoolProfileRepository.getByName(name, id);
      callback(null, res);
      break;
    }
    case 'getCharityProfile': {
      const { name, id } = getCharityProfileSchema.parse(params);

      const res = await charityProfileRepository.getByName(name, id);
      callback(null, res);
      break;
    }
    case 'getSignUpData': {
      const { id } = getSignUpDataSchema.parse(params);

      const res = await signUpDataRepository.getById(id);
      callback(null, res);
      break;
    }
    case 'getRegisteredSchools': {
      const res = await schoolDataRepository.getRegistered();
      callback(null, res);
      break;
    }
    case 'getCharities': {
      const res = await charityDataRepository.list(projectedFields);
      callback(null, res);
      break;
    }
    case 'getRegisteredSchoolsByLa': {
      const { localAuthority } = getRegisteredSchoolsByLaSchema.parse(params);

      const res = await schoolDataRepository.getRegisteredByLa(localAuthority);
      callback(null, res);
      break;
    }
    case 'getSchoolJoinRequestsByLa': {
      const { localAuthority } = getSchoolJoinRequestsByLaSchema.parse(params);

      const res = await joinRequestsRepository.getNewSchoolJoinRequestsByLa(localAuthority);
      callback(null, res);
      break;
    }
    case 'getSchoolsNearby': {
      const { postcode, distance } = getSchoolsNearbySchema.parse(params);

      const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

      const res = await schoolDataRepository.getSchoolsNearby(longitude, latitude, distance);
      callback(null, res);
      break;
    }
    case 'getSchoolsNearbyWithProfile': {
      const { postcode, distance, type } = getSchoolsNearbyWithProfileSchema.parse(params);

      const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

      const res = await schoolDataRepository.getSchoolsNearbyWithProfile(
        longitude,
        latitude,
        distance,
        type
      );
      callback(null, res);
      break;
    }
    case 'getCharitiesNearby': {
      const { postcode, distance } = getCharitiesNearbySchema.parse(params);

      const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

      const res = await charityDataRepository.getCharitiesNearby(longitude, latitude, distance);
      callback(null, res);
      break;
    }
    case 'getCharitiesNearbyWithProfile': {
      const { postcode, distance, type } = getCharitiesNearbyWithProfileSchema.parse(params);

      const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

      const res = await charityDataRepository.getCharitiesNearbyWithProfile(
        longitude,
        latitude,
        distance,
        type
      );
      callback(null, res);
      break;
    }
    case 'getAdminTileStats': {
      const [joined, notJoined, school, charity, registeredSchools, registeredCharities] =
        await Promise.all([
          localAuthorityDataRepository.getRegisteredLocalAuthorityCount(),
          localAuthorityDataRepository.getNotRegisteredLocalAuthorityCount(),
          joinRequestsRepository.getSchoolJoinRequestsCount(),
          joinRequestsRepository.getCharityJoinRequestsCount(),
          schoolDataRepository.getRegisteredSchoolsCount(),
          charityDataRepository.getRegisteredCharityCount(),
        ]);
      const res = {
        la: { joined, notJoined },
        joinRequests: { school, charity },
        registeredSchools,
        registeredCharities,
      };
      callback(null, res);
      break;
    }
    case 'getLaStats': {
      const { name, nameId, email } = getLaStatsSchema.parse(params);

      const [la, schoolRequests, charityRequests] = await Promise.all([
        localAuthorityUserRepository.getByAll(name, nameId, email),
        joinRequestsRepository.getSchoolJoinRequestsCountByLa(name),
        joinRequestsRepository.getCharityJoinRequestsCountByLa(name),
      ]);

      const res = {
        privacyPolicyAccepted: la?.privacyPolicyAccepted ?? false,
        schoolRequests,
        charityRequests,
      };
      callback(null, res);
      break;
    }
    case 'getCharitiesByLa': {
      const { name } = getCharitiesByLaSchema.parse(params);

      const charities = await charityDataRepository.getByLa(name);
      callback(null, charities);
      break;
    }
    case 'getCharityJoinRequestsByLa': {
      const { localAuthority } = getCharityJoinRequestsByLaSchema.parse(params);

      const res = await joinRequestsRepository.getNewCharityJoinRequestsByLa(localAuthority);
      callback(null, res);
      break;
    }
    case 'hasSchoolProfile': {
      const { name, id } = params as QueryHasSchoolProfileArgs;
      const res = await schoolProfileRepository.hasProfile(name, id);
      callback(null, res);
      break;
    }
    case 'hasCharityProfile': {
      const { name, id } = params as QueryHasCharityProfileArgs;
      const res = await charityProfileRepository.hasProfile(name, id);
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
