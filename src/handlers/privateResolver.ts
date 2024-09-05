import middy from '@middy/core';
import errorLogger from '@middy/error-logger';
import { AppSyncResolverEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { AdditionalUsersRepository } from '../repository/additionalUsersRepository';
import { CharityDataRepository } from '../repository/charityDataRepository';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { CharityUserRepository } from '../repository/charityUserRepository';
import { ItemQueriesRepository } from '../repository/itemQueriesRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityRegisterRequestsRepository } from '../repository/localAuthorityRegisterRequestsRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SchoolUserRepository } from '../repository/schoolUserRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { getExistingUsers } from '../shared/account';
import { logger } from '../shared/logger';
import { compression } from '../shared/middleware/compression';
import { inputLogger } from '../shared/middleware/inputLogger';
import { responseSize } from '../shared/middleware/responseSize';
import { middyOptions } from '../shared/middleware/testOptions';
import {
  UserType,
  acceptPrivacyPolicySchema,
  addAdditionalUserSchema,
  deleteCharityProfileSchema,
  deleteDeniedJoinRequestSchema,
  deleteSchoolProfileSchema,
  deleteUserSchema,
  insertItemQuerySchema,
  insertJoinRequestSchema,
  insertLocalAuthorityRegisterRequestSchema,
  insertSignUpDataSchema,
  registerLocalAuthoritySchema,
  updateCharityProfileSchema,
  updateJoinRequestSchema,
  updateSchoolProfileSchema,
  updateUserSchema,
} from './zodSchemas';

const localAuthorityDataRepository = LocalAuthorityDataRepository.getInstance();
const localAuthorityUserRepository = LocalAuthorityUserRepository.getInstance();
const joinRequestsRepository = JoinRequestsRepository.getInstance();
const schoolProfileRepository = SchoolProfileRepository.getInstance();
const charityProfileRepository = CharityProfileRepository.getInstance();
const signUpDataRepository = SignUpDataRepository.getInstance();
const itemQueriesRepository = ItemQueriesRepository.getInstance();
const localAuthorityRegisterRequestsRepository =
  LocalAuthorityRegisterRequestsRepository.getInstance();
const schoolDataRepository = SchoolDataRepository.getInstance();
const schoolUserRepository = SchoolUserRepository.getInstance();
const charityDataRepository = CharityDataRepository.getInstance();
const charityUserRepository = CharityUserRepository.getInstance();
const additionalUsersRepository = AdditionalUsersRepository.getInstance();

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
      const { arguments: params, info } = event;
      logger.info(`${JSON.stringify(params)}`);

      switch (info.fieldName) {
        case 'registerLocalAuthority': {
          const { name, firstName, lastName, email, phone, department, jobTitle, notes, nameId } =
            registerLocalAuthoritySchema.parse(params);

          const register = await localAuthorityDataRepository.setToRegistered(name);
          const insert = await localAuthorityUserRepository.insert({
            name,
            firstName,
            lastName,
            email,
            phone,
            department,
            jobTitle,
            notes,
            nameId,
          });
          return register && insert;
        }
        case 'updateJoinRequest': {
          const { localAuthority, name, status, id } = updateJoinRequestSchema.parse(params);
          return await joinRequestsRepository.updateStatus(id, localAuthority, name, status);
        }
        case 'updateSchoolProfile': {
          const { key, value } = updateSchoolProfileSchema.parse(params);

          const { institution, institutionId } = info.variables as {
            institution: string;
            institutionId: string;
          };
          const { localAuthority = '', postcode = '' } =
            (await schoolDataRepository.get(institution, institutionId)) ?? {};
          return await schoolProfileRepository.updateKey(
            institutionId,
            institution,
            key,
            value,
            localAuthority,
            postcode?.trim() ?? null
          );
        }
        case 'updateCharityProfile': {
          const { key, value } = updateCharityProfileSchema.parse(params);

          const { institution, institutionId } = info.variables as {
            institution: string;
            institutionId: string;
          };

          const { localAuthority = '', postcode } =
            (await charityDataRepository.getById(institutionId)) ?? {};
          const currentCharity = await charityProfileRepository.getByName(
            institution,
            institutionId
          );
          const profilePostcode = currentCharity?.postcode?.trim();

          const res = await charityProfileRepository.updateKey(
            institutionId,
            institution,
            key,
            value,
            localAuthority
          );

          if (key === 'postcode') {
            await charityDataRepository.updatePostcode(
              institutionId,
              institution,
              localAuthority,
              value.trim()
            );
          }

          if (!profilePostcode && postcode) {
            await charityProfileRepository.updateKey(
              institutionId,
              institution,
              'postcode',
              postcode.trim(),
              localAuthority
            );
          }
          return res;
        }
        case 'insertSignUpData': {
          const { id, email, type, name, nameId } = insertSignUpDataSchema.parse(params);
          return await signUpDataRepository.insert({ id, email, type, name, nameId });
        }
        case 'deleteSignUpData': {
          const { id, email } = insertSignUpDataSchema.parse(params);
          return await signUpDataRepository.deleteSignUpRequest(id, email);
        }
        case 'insertJoinRequest': {
          const status = 'NEW';
          const id = uuidv4();
          const requestTime = Number(new Date());
          return await joinRequestsRepository.insert({
            ...insertJoinRequestSchema.parse(params),
            status,
            requestTime,
            id,
          });
        }
        case 'insertItemQuery': {
          const {
            name,
            email,
            type,
            message,
            who,
            phone,
            connection,
            organisationType,
            organisationName,
            organisationId,
          } = insertItemQuerySchema.parse(params);

          return await itemQueriesRepository.insert({
            name,
            email,
            type,
            message,
            who,
            phone,
            organisationId,
            organisationName,
            organisationType,
            ...(connection && { connection }),
          });
        }
        case 'insertLocalAuthorityRegisterRequest': {
          const { name, localAuthority, email, message, type } =
            insertLocalAuthorityRegisterRequestSchema.parse(params);

          return await localAuthorityRegisterRequestsRepository.insert({
            name,
            localAuthority,
            email,
            message,
            type,
          });
        }
        case 'deleteDeniedJoinRequest': {
          const { id } = deleteDeniedJoinRequestSchema.parse(params);
          return await joinRequestsRepository.deleteDenied(id);
        }
        case 'deleteSchoolProfile': {
          const { name, id } = deleteSchoolProfileSchema.parse(params);

          const res = await schoolProfileRepository.deleteSchoolProfile(name, id);
          await schoolDataRepository.unregister(name, id);
          return res;
        }
        case 'acceptPrivacyPolicy': {
          const { name, nameId, email } = acceptPrivacyPolicySchema.parse(params);
          return await localAuthorityUserRepository.setPrivacyPolicyAccepted(name, nameId, email);
        }
        case 'deleteCharityProfile': {
          const { name, id } = deleteCharityProfileSchema.parse(params);

          const res = await charityProfileRepository.deleteCharityProfile(name, id);
          const dataRes = await charityDataRepository.deleteCharity(name, id);
          return res && dataRes;
        }
        case 'updateUser': {
          const { userType, name, id, institutionName, email, phone, jobTitle, department } =
            updateUserSchema.parse(params);
          if (userType === UserType.Charity) {
            const user = {
              name,
              charityId: id,
              charityName: institutionName,
              email,
              jobTitle,
              phone,
            };
            return await charityUserRepository.update(user);
          }
          if (userType === UserType.School) {
            const user = {
              name,
              schoolId: id,
              schoolName: institutionName,
              email,
              jobTitle,
              phone,
            };
            return await schoolUserRepository.update(user);
          }
          if (userType === UserType.La) {
            return await localAuthorityUserRepository.update(
              id,
              jobTitle,
              phone,
              String(department)
            );
          }
          throw new Error(`Unexpected type ${userType}`);
        }
        case 'deleteUserProfile': {
          const { name, id, userType, email } = deleteUserSchema.parse(params);
          switch (userType) {
            case UserType.School: {
              const res = await schoolUserRepository.deleteUser(id, email);
              if (res) {
                await signUpDataRepository.deleteSignUpRequestAfterProfileDeletion(id, email);
              }
              const registeredUsers = await schoolUserRepository.getAllById(id);
              if (!registeredUsers?.length) {
                await schoolDataRepository.unregister(name, id);
                await schoolProfileRepository.deleteSchoolProfile(name, id);
              }
              return res;
            }
            case UserType.Charity: {
              const res = await charityUserRepository.deleteUser(id, email);
              if (res) {
                await signUpDataRepository.deleteSignUpRequestAfterProfileDeletion(id, email);
              }
              const registeredUsers = await charityUserRepository.getAllById(id);
              if (!registeredUsers?.length) {
                await charityDataRepository.deleteCharity(name, id);
                await charityProfileRepository.deleteCharityProfile(name, id);
              }
              return res;
            }
            case UserType.La: {
              const res = await localAuthorityUserRepository.deleteUser(id, email);
              if (res) {
                await signUpDataRepository.deleteSignUpRequestAfterProfileDeletion(id, email);
              }
              const laUsers = await localAuthorityUserRepository.getAllById(id);
              if (!laUsers?.length) {
                await localAuthorityUserRepository.useAdminAsDefaultUser(name);
              }
              return res;
            }
            default:
              throw new Error(`Unexpected type ${userType}`);
          }
        }
        case 'addAdditionalUser': {
          const user = addAdditionalUserSchema.parse(params);
          const { type, name } = user;
          const existingUsers = await getExistingUsers(type, name);
          if (existingUsers > 2) {
            throw new Error('Too many users associated with this account');
          }
          return await additionalUsersRepository.insert(user);
        }
        default: {
          throw new Error(`Unexpected type ${info.fieldName}`);
        }
      }
    }
  );
