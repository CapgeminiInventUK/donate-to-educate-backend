import { AppSyncResolverHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  MutationAcceptPrivacyPolicyArgs,
  MutationDeleteCharityProfileArgs,
  MutationDeleteDeniedJoinRequestArgs,
  MutationDeleteSchoolProfileArgs,
  MutationInsertItemQueryArgs,
  MutationInsertJoinRequestArgs,
  MutationInsertLocalAuthorityRegisterRequestArgs,
  MutationInsertSignUpDataArgs,
  MutationRegisterLocalAuthorityArgs,
  MutationUpdateCharityProfileArgs,
  MutationUpdateJoinRequestArgs,
  MutationUpdateSchoolProfileArgs,
} from '../../appsync';
import { CharityDataRepository } from '../repository/charityDataRepository';
import { CharityProfileRepository } from '../repository/charityProfileRepository';
import { ItemQueriesRepository } from '../repository/itemQueriesRepository';
import { JoinRequestsRepository } from '../repository/joinRequestsRepository';
import { LocalAuthorityDataRepository } from '../repository/localAuthorityDataRepository';
import { LocalAuthorityRegisterRequestsRepository } from '../repository/localAuthorityRegisterRequestsRepository';
import { LocalAuthorityUserRepository } from '../repository/localAuthorityUserRepository';
import { SchoolDataRepository } from '../repository/schoolDataRepository';
import { SchoolProfileRepository } from '../repository/schoolProfileRepository';
import { SignUpDataRepository } from '../repository/signUpDataRepository';
import { logger } from '../shared/logger';
import {
  acceptPrivacyPolicySchema,
  deleteCharityProfileSchema,
  deleteDeniedJoinRequestSchema,
  deleteSchoolProfileSchema,
  insertItemQuerySchema,
  insertJoinRequestSchema,
  insertLocalAuthorityRegisterRequestSchema,
  insertSignUpDataSchema,
  registerLocalAuthoritySchema,
  updateCharityProfileSchema,
  updateJoinRequestSchema,
  updateSchoolProfileSchema,
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
const charityDataRepository = CharityDataRepository.getInstance();

export const handler: AppSyncResolverHandler<
  | MutationRegisterLocalAuthorityArgs
  | MutationInsertSignUpDataArgs
  | MutationUpdateSchoolProfileArgs
  | MutationUpdateCharityProfileArgs
  | MutationUpdateJoinRequestArgs
  | MutationInsertItemQueryArgs
  | MutationInsertJoinRequestArgs
  | MutationDeleteDeniedJoinRequestArgs
  | MutationDeleteSchoolProfileArgs
  | MutationAcceptPrivacyPolicyArgs
  | MutationDeleteCharityProfileArgs
  | MutationInsertLocalAuthorityRegisterRequestArgs,
  boolean
> = async (event, context) => {
  logger.info(`Running function with ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;

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
        postcode
      );
    }
    case 'updateCharityProfile': {
      const { key, value } = updateCharityProfileSchema.parse(params);

      const { institution, institutionId } = info.variables as {
        institution: string;
        institutionId: string;
      };

      const { localAuthority = '' } = (await charityDataRepository.getById(institutionId)) ?? {};
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
          value
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

    default: {
      throw new Error(`Unexpected type ${info.fieldName}`);
    }
  }
};
