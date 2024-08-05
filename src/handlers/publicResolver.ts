import middy from '@middy/core';
import errorLogger from '@middy/error-logger';
import { AppSyncResolverEvent } from 'aws-lambda';
import {
  CharityUser,
  LocalAuthority,
  LocalAuthorityUser,
  QueryHasCharityProfileArgs,
  QueryHasSchoolProfileArgs,
  School,
  SchoolUser,
} from '../../appsync';
import { CharityDataRepository } from '../repository/charityDataRepository';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { CharityUserRepository } from '../repository/charityUserRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SchoolUserRepository } from '../repository/schoolUserRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { removeFields } from '../shared/graphql';
import { logger } from '../shared/logger';
import { compression } from '../shared/middleware/compression';
import { inputLogger } from '../shared/middleware/inputLogger';
import { responseSize } from '../shared/middleware/responseSize';
import { middyOptions } from '../shared/middleware/testOptions';
import { convertPostcodeToLatLng } from '../shared/postcode';
import { addSchoolsRequestState, infoType } from '../shared/schools';
import {
  getCharitiesByLaSchema,
  getCharitiesNearbySchema,
  getCharitiesNearbyWithProfileSchema,
  getCharityJoinRequestsByLaSchema,
  getCharityProfileSchema,
  getLaStatsSchema,
  getRegisteredSchoolsByLaSchema,
  getSchoolJoinRequestsByLaSchema,
  getSchoolProfileSchema,
  getSchoolSchema,
  getSchoolsByLaSchema,
  getSchoolsNearbySchema,
  getSchoolsNearbyWithProfileSchema,
  getSignUpDataSchema,
  getUserSchema,
} from './zodSchemas';

const schoolDataRepository = SchoolDataRepository.getInstance();
const charityDataRepository = CharityDataRepository.getInstance();
const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();
const charityUserRepository = CharityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const charityProfileRepository = CharityProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();

// Handlers are evaluated in reverse order
export const handler = middy(middyOptions)
  .use(responseSize())
  .use(compression())
  .use(inputLogger())
  .use(
    errorLogger({
      logger: (request) => logger.error(request.error),
    })
  )
  .handler(
    async (event: AppSyncResolverEvent<Record<string, string | null | undefined | number>>) => {
      const { arguments: params, info } =
        'info' in event
          ? event
          : // This is only used locally
            (JSON.parse((event as { body: string }).body) as {
              arguments: Record<string, string>;
              info: infoType;
            });
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
        case 'getSchool': {
          const { name, urn } = getSchoolSchema.parse(params);
          const school = await schoolDataRepository.get(name, urn);

          if (!school) {
            return [];
          }
          return removeFields<School>(info.selectionSetList, school);
        }
        case 'getLocalAuthorityUser': {
          const { email } = getUserSchema.parse(params);

          const laUser = await localAuthorityUserRepository.getByEmail(email);

          if (!laUser) {
            return null;
          }

          return removeFields<LocalAuthorityUser>(info.selectionSetList, laUser);
        }
        case 'getSchoolUser': {
          const { email } = getUserSchema.parse(params);

          const schoolUser = await schoolUserRepository.getByEmail(email);

          if (!schoolUser) {
            return null;
          }

          return removeFields<SchoolUser>(info.selectionSetList, schoolUser);
        }
        case 'getCharityUser': {
          const { email } = getUserSchema.parse(params);

          const charityUser = await charityUserRepository.getByEmail(email);

          if (!charityUser) {
            return null;
          }

          return removeFields<CharityUser>(info.selectionSetList, charityUser);
        }
        case 'getSchoolsByLa': {
          const { name } = getSchoolsByLaSchema.parse(params);

          const schools = await schoolDataRepository.getByLa(name);
          return schools.map((school) => removeFields<School>(info.selectionSetList, school));
        }
        case 'getSchools': {
          const schools = await schoolDataRepository.list(projectedFields);
          const localAuthorities = await localAuthorityDataRepository.list();
          const schoolJoinRequests = await joinRequestsRepository.getNewSchoolJoinRequests();
          return addSchoolsRequestState(schools, localAuthorities, schoolJoinRequests, info);
        }
        case 'getLocalAuthorities': {
          const las = await localAuthorityDataRepository.list();
          return las.map((la) => removeFields<LocalAuthority>(info.selectionSetList, la));
        }
        case 'getJoinRequests': {
          return await joinRequestsRepository.getNewJoinRequests();
        }
        case 'getSchoolProfile': {
          const { name, id } = getSchoolProfileSchema.parse(params);
          return await schoolProfileRepository.getByName(name, id);
        }
        case 'getCharityProfile': {
          const { name, id } = getCharityProfileSchema.parse(params);
          return await charityProfileRepository.getByName(name, id);
        }
        case 'getSignUpData': {
          const { id } = getSignUpDataSchema.parse(params);
          return await signUpDataRepository.getById(id);
        }
        case 'getRegisteredSchools': {
          return await schoolDataRepository.getRegistered();
        }
        case 'getCharities': {
          return await charityDataRepository.list(projectedFields);
        }
        case 'getRegisteredSchoolsByLa': {
          const { localAuthority } = getRegisteredSchoolsByLaSchema.parse(params);
          return await schoolDataRepository.getRegisteredByLa(localAuthority);
        }
        case 'getSchoolJoinRequestsByLa': {
          const { localAuthority } = getSchoolJoinRequestsByLaSchema.parse(params);
          return await joinRequestsRepository.getNewSchoolJoinRequestsByLa(localAuthority);
        }
        case 'getSchoolsNearby': {
          const { postcode, distance } = getSchoolsNearbySchema.parse(params);

          const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

          return await schoolDataRepository.getSchoolsNearby(longitude, latitude, distance);
        }
        case 'getSchoolsNearbyWithProfile': {
          const { postcode, distance, type, limit } =
            getSchoolsNearbyWithProfileSchema.parse(params);

          const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

          return await schoolDataRepository.getSchoolsNearbyWithProfile(
            longitude,
            latitude,
            distance,
            limit,
            type
          );
        }
        case 'getCharitiesNearby': {
          const { postcode, distance } = getCharitiesNearbySchema.parse(params);

          const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

          return await charityDataRepository.getCharitiesNearby(longitude, latitude, distance);
        }
        case 'getCharitiesNearbyWithProfile': {
          const { postcode, distance, type, limit } =
            getCharitiesNearbyWithProfileSchema.parse(params);

          const [longitude, latitude] = await convertPostcodeToLatLng(postcode.replace(/\s/g, ''));

          return await charityDataRepository.getCharitiesNearbyWithProfile(
            longitude,
            latitude,
            distance,
            limit,
            type
          );
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
          return {
            la: { joined, notJoined },
            joinRequests: { school, charity },
            registeredSchools,
            registeredCharities,
          };
        }
        case 'getLaStats': {
          const { name, nameId, email } = getLaStatsSchema.parse(params);

          const [la, schoolRequests, charityRequests] = await Promise.all([
            localAuthorityUserRepository.getByAll(name, nameId, email),
            joinRequestsRepository.getSchoolJoinRequestsCountByLa(name),
            joinRequestsRepository.getCharityJoinRequestsCountByLa(name),
          ]);

          return {
            privacyPolicyAccepted: la?.privacyPolicyAccepted ?? false,
            schoolRequests,
            charityRequests,
          };
        }
        case 'getCharitiesByLa': {
          const { name } = getCharitiesByLaSchema.parse(params);
          return await charityDataRepository.getByLa(name);
        }
        case 'getCharityJoinRequestsByLa': {
          const { localAuthority } = getCharityJoinRequestsByLaSchema.parse(params);
          return await joinRequestsRepository.getNewCharityJoinRequestsByLa(localAuthority);
        }
        case 'hasSchoolProfile': {
          const { name, id } = params as QueryHasSchoolProfileArgs;
          return await schoolProfileRepository.hasProfile(name, id);
        }
        case 'hasCharityProfile': {
          const { name, id } = params as QueryHasCharityProfileArgs;
          return await charityProfileRepository.hasProfile(name, id);
        }

        default: {
          throw new Error(`Unexpected type ${info.fieldName}`);
        }
      }
    }
  );
